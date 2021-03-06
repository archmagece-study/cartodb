<%
if (scope === 'organization') {
  person_scope = 'You and all organization users';
} else if (scope === 'organization_user') {
  person_scope = 'The user';
} else {
  person_scope = 'You';
}
%>

<div class="CDB-Text Dialog-header u-inner">
  <div class="Dialog-headerIcon Dialog-headerIcon--negative">
    <i class="CDB-IconFont CDB-IconFont-keys"></i>
  </div>
  <p class="Dialog-headerTitle u-ellipsLongText">
  <% if (scope === 'organization') { %>
    You are about to regenerate the <%- type === "api" ? 'API keys' : 'OAuth credentials' %> for all the users of the organization
  <% } else if (scope === 'organization_user') { %>
    You are about to regenerate the <%- type === "api" ? 'API keys' : 'OAuth credentials' %> for this user of the organization
  <% } else { %>
    You are about to regenerate your <%- type === "api" ? 'API keys' : 'OAuth credentials' %>
  <% } %>
  </p>
  <p class="Dialog-headerText">
    <% if (type === "api") { %>
      <%- person_scope %> will need to update all deployed apps with the new API keys. Are you sure you want to continue?
    <% } else { %>
      <%- person_scope %> will have to update all OAuth keys in apps where you are using CARTO. Are you sure?
    <% } %>
  </p>
</div>
<form action="<%- form_action %>" method="post">
  <% if (passwordNeeded) { %>
    <div class="CDB-Text Dialog-body">
      <div class="Form-row Form-row--centered has-label">
        <div class="Form-rowLabel">
          <label class="Form-label">Your password</label>
        </div>
        <div class="Form-rowData">
          <input type="password" id="deletion_password_confirmation" name="password_confirmation" class="CDB-InputText CDB-Text Form-input Form-input--long" value=""/>
        </div>
      </div>
    </div>
  <% } %>

  <div class="Dialog-footer u-inner">
    <button type="button" class="CDB-Button CDB-Button--secondary js-cancel">
      <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">cancel</span>
    </button>

    <input name="utf8" type="hidden" value="&#x2713;" />
    <input name="_method" type="hidden" value="<%- method %>" />
    <input name="authenticity_token" type="hidden" value="<%- authenticity_token %>" />
    <button type="submit" class="CDB-Button CDB-Button--error">
      <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">Regenerate <%- type === "api" ? 'API keys' : 'OAuth credentials' %></span>
    </button>
  </div>
</form>
