/* global cdb */
var _ = require('underscore');
var BackgroundPollingModel = require('../../../../javascripts/cartodb/dashboard/background_polling_model');
var ImportCollection = require('../../../../javascripts/cartodb/common/background_polling/models/imports_collection');

function attributesForRedirect (attrs) {
  return _.extend({
    tables_created_count: 2,
    service_name: 'other',
    table_name: 'foobar',
    state: 'complete',
    display_name: 'foo.carto'
  }, attrs);
}

describe('dashboard/background_polling_model', function () {
  beforeEach(function () {
    this.user = new cdb.admin.User({
      username: 'pepe',
      base_url: 'http://pepe.carto.com'
    });
    this.importsCollection = new ImportCollection({}, {
      user: this.user
    });
    this.importsModel = this.importsCollection.at(0);
    this.model = new BackgroundPollingModel({}, {
      user: this.user,
      importsCollection: this.importsCollection
    });
    spyOn(this.model, '_redirectTo');
    this.url = new cdb.common.MapUrl({
      base_url: 'http://pepe.carto.com/viz/abc-123'
    });
    spyOn(cdb.admin.Visualization.prototype, 'viewUrl').and.returnValue(this.url);
    this.importsModel.set('step', 'import');

    // Add some more imports to the collection
    this.importsCollection.add({});
    this.importsCollection.add({});
    this.importsModel2 = this.importsCollection.at(1);
    this.importsModel3 = this.importsCollection.at(2);

    // Two previous imports have failed
    spyOn(this.importsModel2, 'hasCompleted').and.returnValue(false);
    spyOn(this.importsModel2, 'hasFailed').and.returnValue(true);
    spyOn(this.importsModel3, 'hasCompleted').and.returnValue(false);
    spyOn(this.importsModel3, 'hasFailed').and.returnValue(true);
  });

  describe('when import has been completed', function () {
    beforeEach(function () {
      spyOn(this.importsModel, 'hasCompleted').and.returnValue(true);
    });

    it('should redirect to vis', function () {
      this.importsModel.imp.set(attributesForRedirect());

      expect(this.model._redirectTo).toHaveBeenCalled();
      expect(this.model._redirectTo.calls.argsFor(0)[0]).toEqual('http://pepe.carto.com/viz/abc-123/map');
      expect(cdb.admin.Visualization.prototype.viewUrl).toHaveBeenCalledWith(this.user);
    });

    describe('should NOT redirect', function () {
      it('if more than one table is created and file is not .carto', function () {
        this.importsModel.imp.set(attributesForRedirect({
          tables_created_count: 2,
          display_name: 'foo.csv'
        }));
        this.importsModel.set('state', 'complete');

        expect(this.model._redirectTo).not.toHaveBeenCalled();
      });

      it('if service name is twitter search', function () {
        this.importsModel.imp.set(attributesForRedirect({
          'service_name': 'twitter_search'
        }));
        this.importsModel.set('state', 'complete');

        expect(this.model._redirectTo).not.toHaveBeenCalled();
      });

      it('if for some reason there is no vis to redirect to', function () {
        spyOn(this.importsModel, 'importedVis').and.returnValue(false);

        this.importsModel.set('state', 'complete');

        expect(this.model._redirectTo).not.toHaveBeenCalled();
      });

      it('if other imports are still running', function () {
        this.importsModel2.hasCompleted.and.returnValue(false);
        this.importsModel2.hasFailed.and.returnValue(false);

        this.importsModel.imp.set(attributesForRedirect());
        this.importsModel.set('state', 'complete');

        expect(this.model._redirectTo).not.toHaveBeenCalled();
      });

      it('if other imports have been completed', function () {
        // Has failed
        this.importsModel2.hasFailed.and.returnValue(true);
        this.importsModel2.hasCompleted.and.returnValue(false);
        // Has completed
        this.importsModel3.hasFailed.and.returnValue(false);
        this.importsModel3.hasCompleted.and.returnValue(true);

        this.importsModel.imp.set(attributesForRedirect());
        this.importsModel.set('state', 'complete');

        expect(this.model._redirectTo).not.toHaveBeenCalled();
      });
    });
  });

  describe('when import has NOT been completed', function () {
    beforeEach(function () {
      spyOn(this.importsModel, 'hasCompleted').and.returnValue(false);
    });

    it('should not redirect if not complete yet', function () {
      this.importsModel.set('state', 'whatever');
      expect(this.model._redirectTo).not.toHaveBeenCalled();
    });
  });
});
