sap.ui.define(
  [
    "apptorparameters/controller/BaseController",
    "apptorparameters/utils/Constants",
    "apptorparameters/utils/Services",
    "apptorparameters/utils/DataManager"
  ],
  function (BaseController, Constants, Services, DataManager) {
    "use strict";
    return BaseController.extend("apptorparameters.controller.App", {
      /** Lifecycle hook for initialization */
      onInit: function () {
        this.createModels();
      },

      /** Create models related to the APP */
      createModels: function () {
        let localModel = this.getOwnerComponent().getModel(
          Constants.model.LOCAL_MODEL
        );
        localModel.setProperty(Constants.property.MAIN_BINDING, {});
        DataManager.setLocalModel(localModel);
        Services.setMainModel(
          this.getOwnerComponent().getModel(Constants.model.ODATA_MODEL)
        );
        Services.setValueHelpModel(
          this.getOwnerComponent().getModel(
            Constants.model.ODATA_MODEL_VALUEHELP
          )
        );
        Services.setUserRolesModel(
          this.getOwnerComponent().getModel(Constants.model.USER_ROLES_MODEL)
        );
        this.getMessageModel().setProperty("/", []);
        localModel.setProperty(
          Constants.property.O_SELECT_LANG,
          this.getArrayLanguages()
        );
      }
    });
  }
);
