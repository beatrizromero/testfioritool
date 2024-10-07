sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "apptorparameters/utils/Constants",
    "apptorparameters/utils/Services",
    "apptorparameters/utils/Utils"
  ],
  function (Controller, Constants, Services, Utils) {
    "use strict";
    return Controller.extend("apptorparameters.controller.BaseController", {
      /**
       * is a convenient method to get the router in the context of a SAP UI5 controller, allowing navigation actions in the application
       * @returns {object} Object router
       */
      getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(this);
      },

      /**
       * Convenience method for getting the resource bundle.
       * @public
       * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
       */
      getResourceBundle: function () {
        return this.getOwnerComponent()
          .getModel(Constants.model.I18N_MODEL)
          .getResourceBundle();
      },

      /**
       * Get model related to message popover
       * @returns {object} Object message model
       */
      getMessageModel: function () {
        return this.getOwnerComponent().getModel(Constants.model.MESSAGE_MODEL);
      },

      /**
       * Create filter language model in select controls
       * @returns {Array} Array with languages
       */
      getArrayLanguages: function () {
        return [
          {
            key: "",
            value: ""
          },
          {
            key: "EN",
            value: "EN"
          },
          {
            key: "FR",
            value: "FR"
          }
        ];
      },
      /**
       * Gets the roles of the person accessing the application to determine if they can edit or view only
       */
      isEditUser: function () {
        Services.getUserRoles()
          .then((oData) => {
            let bTorEditor = false;
            if (oData !== undefined) {
              if (Object.keys(oData.value).includes(Constants.TOR_MASTERDATA)) {
                bTorEditor = true;
              } else {
                let errorResponse = this.getResourceBundle().getText(
                  "service.information.userRolesOnlyView"
                );
                this.getMessageModel().setProperty("/", [
                  Utils.returnMessage(
                    this,
                    Constants.state.INFORMATION,
                    errorResponse
                  )
                ]);
                this.getMessageModel().refresh();
              }
            } else {
              bTorEditor = true;
            }
            this.getView()
              .getModel(Constants.model.ROLES_MODEL)
              .setProperty(Constants.property.IS_EDIT_USER, bTorEditor);
          })
          .catch((oError) => {
            let errorResponse = oError.responseText;
            // Parsear la cadena JSON a un objeto JavaScript
            let errorObject = JSON.parse(errorResponse);
            // Extraer el mensaje de error específico
            let errorMessage =
              errorObject.error !== undefined
                ? errorObject.error.message.value
                : errorResponse;
            this.getMessageModel().setProperty("/", [
              Utils.returnMessage(this, Constants.state.ERROR, errorMessage)
            ]);
            this.getMessageModel().refresh();
          });
      }
    });
  }
);
