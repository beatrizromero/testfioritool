sap.ui.define(
  ["apptorparameters/utils/Constants"],
  function (Constants) {
    "use strict";
    return {
      /**
       * Set the mainModel
       * @param {object} oModel - Main model object
       */
      setMainModel: function (oModel) {
        this.oMainModel = oModel;
      },

      /**
       * get the mainModel
       * @returns {object} Returns Main model object
       */
      getMainModel: function () {
        return this.oMainModel;
      },

      /**
       * set the valueHelpModel from matchcodes
       * @param {object} oModel - ValueHelpModel model object
       */
      setValueHelpModel: function (oModel) {
        this.oValueHelpModel = oModel;
      },

      /**
       * get the valueHelpModel
       * @returns {object} Returns ValueHelpModel model object
       */
      getValueHelpModel: function () {
        return this.oValueHelpModel;
      },

      /* Set the userRolesModel model
       * @param {object} oModel - userRolesModel object
       */
      setUserRolesModel: function (oModel) {
        this.oUserRoles = oModel;
      },

      /**
       * Get the userRolesModel
       * @returns {object} Returns userRolesModel object
       */
      getUserRolesModel: function () {
        return this.oUserRoles;
      },

      /**
       * Call to service to get "/TOR_PARAMETER_TOTALView" entity
       * @param {Array} aFilters - Array of filters in filterbar control
       * @returns {object} Returns a promise object for service call
       */
      readTorParameterTotalView: function (aFilters) {
        return new Promise((resolve, reject) => {
          let oServiceInfo = {
            success: function (oData) {
              if (oData.results && oData.results.length > 0) {
                resolve(oData.results);
              } else {
                reject(oData);
              }
            },
            error: function (oError) {
              reject(oError);
            }
          };
          oServiceInfo.filters =
            aFilters && aFilters.length > 0 ? aFilters : [];
          this.getMainModel().read(
            Constants.entity.ENTITY_TOR_PARAMETER_TOTALVIEW,
            oServiceInfo
          );
        });
      },

      /**
       * Call to service to push "/TOR_PARAMETERView" entity
       * @param {object} oCreate - Object with properties for create a new parameter
       * @returns {object} Returns a promise object for service call
       */
      createTorParameterView: function (oCreate) {
        return new Promise((resolve, reject) => {
          let oServiceInfo = {
            success: function (oData) {
              resolve(oData);
            },
            error: function (oError) {
              reject(oError);
            }
          };
          this.getMainModel().create(
            Constants.entity.TOR_PARAMETERView,
            oCreate,
            oServiceInfo
          );
        });
      },

      /**
       * Call to service to push "/TOR_PARAMETERView" entity
       * @param {object} oCreate - Object with properties for create a new parameter
       * @returns {object} Returns a promise object for service call
       */
      prepareTorParameterView: function (oCreate) {
        return new Promise((resolve, reject) => {
          let oServiceInfo = {
            success: function (oData) {
              resolve(oData);
            },
            error: function (oError) {
              reject(oError);
            }
          };
          this.getMainModel().create(
            Constants.entity.TOR_PARAMETERView +
              "(param='" +
              oCreate.param +
              "',param_value='" +
              oCreate.param_value +
              "',IsActiveEntity=false)/CatalogParameters.draftPrepare",
            { SideEffectsQualifier: "" },
            oServiceInfo
          );
        });
      },

      /**
       * Call to service to push "/TOR_PARAMETERView" entity
       * @param {object} oCreate - Object with properties for create a new parameter
       * @returns {object} Returns a promise object for service call
       */
      activateTorParameterView: function (oCreate) {
        return new Promise((resolve, reject) => {
          let oServiceInfo = {
            success: function (oData) {
              resolve(oData);
            },
            error: function (oError) {
              reject(oError);
            }
          };
          this.getMainModel().create(
            Constants.entity.TOR_PARAMETERView +
              "(param='" +
              oCreate.param +
              "',param_value='" +
              oCreate.param_value +
              "',IsActiveEntity=false)/CatalogParameters.draftActivate",
            {},
            oServiceInfo
          );
        });
      },

      /**
       * Call to service to push "/TOR_PARAMETER_DESCView" entity
       * @param {object} oCreate - Object with properties for create a new parameter
       * @returns {object} Returns a promise object for service call
       */
      createTorParameterDescView: function (oCreate) {
        return new Promise((resolve, reject) => {
          let oServiceInfo = {
            success: function (oData) {
              resolve(oData);
            },
            error: function (oError) {
              reject(oError);
            }
          };
          this.getMainModel().create(
            Constants.entity.TOR_PARAMETER_DESCView,
            oCreate,
            oServiceInfo
          );
        });
      },

      /**
       * Call to service to delete "/TOR_PARAMETER_View" entity
       * @param {object} oParams - Object with properties of selected parameter in main view
       * @returns {object} Returns a promise object for service call
       */
      deleteTorParameterView: function (oParams) {
        return new Promise((resolve, reject) => {
          let oServiceInfo = {
            success: function (oData) {
              resolve(oData);
            },
            error: function (oError) {
              reject(oError);
            }
          };
          this.getMainModel().remove(
            Constants.entity.TOR_PARAMETERView +
              "(param='" +
              oParams.param +
              "',param_value='" +
              oParams.param_value +
              "',IsActiveEntity=true)",
            oServiceInfo
          );
        });
      },

      /**
       * Call to service to delete "/TOR_PARAMETER_DESCView" entity
       * @param {object} oParams - Object with properties of selected parameter in main view
       * @returns {object} Returns a promise object for service call
       */
      deleteTorParameterDescView: function (oParams) {
        return new Promise((resolve, reject) => {
          let oServiceInfo = {
            success: function (oData) {
              resolve(oData);
            },
            error: function (oError) {
              reject(oError);
            }
          };
          this.getMainModel().remove(
            Constants.entity.TOR_PARAMETER_DESCView +
              "(param='" +
              oParams.param +
              "',param_value='" +
              oParams.param_value +
              "',lang='" +
              oParams.lang +
              "',IsActiveEntity=true)",
            oServiceInfo
          );
        });
      },

      /**
       * Call to service to push "/TOR_PARAMETER_DESCView" entity
       * @param {object} oParams - Object with properties of selected parameter in main view
       * @returns {object} Returns a promise object for service call
       */
      draftEditTorParameterDescView: function (oParams) {
        return new Promise((resolve, reject) => {
          let oServiceInfo = {
            success: function (oData) {
              resolve(oData);
            },
            error: function (oError) {
              reject(oError);
            }
          };
          this.getMainModel().create(
            Constants.entity.TOR_PARAMETER_DESCView +
              "(param='" +
              oParams.param +
              "',param_value='" +
              oParams.param_value +
              "',lang='" +
              oParams.lang +
              "',IsActiveEntity=true)/CatalogParameters.draftEdit",
            { PreserveChanges: true },
            oServiceInfo
          );
        });
      },

      /**
       * Call to service to push "/TOR_PARAMETER_DESCView" entity
       * @param {object} oParams - Object with properties of selected parameter in main view
       * @returns {object} Returns a promise object for service call
       */
      editTorParameterDescView: function (oParams) {
        return new Promise((resolve, reject) => {
          let oServiceInfo = {
            success: function (oData) {
              resolve(oData);
            },
            error: function (oError) {
              reject(oError);
            }
          };
          this.getMainModel().update(
            Constants.entity.TOR_PARAMETER_DESCView +
              "(param='" +
              oParams.param +
              "',param_value='" +
              oParams.param_value +
              "',lang='" +
              oParams.lang +
              "',IsActiveEntity=false)",
            { param_value_desc: oParams.param_value_desc },
            oServiceInfo
          );
        });
      },

      /**
       * Call to service to push "/TOR_PARAMETER_DESCView" entity
       * @param {object} oParams - Object with properties of selected parameter in main view
       * @returns {object} Returns a promise object for service call
       */
      prepareTorParameterDescView: function (oParams) {
        return new Promise((resolve, reject) => {
          let oServiceInfo = {
            success: function (oData) {
              resolve(oData);
            },
            error: function (oError) {
              reject(oError);
            }
          };
          this.getMainModel().create(
            Constants.entity.TOR_PARAMETER_DESCView +
              "(param='" +
              oParams.param +
              "',param_value='" +
              oParams.param_value +
              "',lang='" +
              oParams.lang +
              "',IsActiveEntity=false)/CatalogParameters.draftPrepare",
            { SideEffectsQualifier: "" },
            oServiceInfo
          );
        });
      },

      /**
       * Call to service to push "/TOR_PARAMETER_DESCView" entity
       * @param {object} oParams - Object with properties of selected parameter in main view
       * @returns {object} Returns a promise object for service call
       */
      activateTorParameterDescView: function (oParams) {
        return new Promise((resolve, reject) => {
          let oServiceInfo = {
            success: function (oData) {
              resolve(oData);
            },
            error: function (oError) {
              reject(oError);
            }
          };
          this.getMainModel().create(
            Constants.entity.TOR_PARAMETER_DESCView +
              "(param='" +
              oParams.param +
              "',param_value='" +
              oParams.param_value +
              "',lang='" +
              oParams.lang +
              "',IsActiveEntity=false)/CatalogParameters.draftActivate",
            {},
            oServiceInfo
          );
        });
      },

      /**
       * Call to service to get "/TOR_PARAMETER_View" entity
       * @param {object} oParams - Object with properties of selected parameter in main view
       * @returns {object} Returns a promise object for service call
       */
      readTorParameterView: function (oParams) {
        return new Promise((resolve) => {
          let oServiceInfo = {
            success: function (oData) {
              resolve(oData);
            },
            error: function (oError) {
              resolve(oError);
            }
          };
          this.getMainModel().read(
            Constants.entity.TOR_PARAMETERView +
              "(param='" +
              oParams.param +
              "',param_value='" +
              oParams.param_value +
              "',IsActiveEntity=true)",
            oServiceInfo
          );
        });
      },

      /**
       * Call to service to get "/TOR_PARAMETER_DESCView" entity
       * @param {object} oParams - Object with properties of selected parameter in main view
       * @returns {object} Returns a promise object for service call
       */
      readTorParameterDescView: function (oParams) {
        return new Promise((resolve) => {
          let oServiceInfo = {
            success: function (oData) {
              resolve(oData);
            },
            error: function (oError) {
              resolve(oError);
            }
          };
          this.getMainModel().read(
            Constants.entity.TOR_PARAMETER_DESCView +
              "(param='" +
              oParams.param +
              "',param_value='" +
              oParams.param_value +
              "',lang='" +
              oParams.lang +
              "')",
            oServiceInfo
          );
        });
      },

      /**
       * Call to service to get "/TOR_PARAMETER_DESCView" entity
       * @param {Array} aFilters - Array of filters in filterbar control
       * @returns {object} Returns a promise object for service call
       */
      readFilterTorParameterDescView: function (aFilters) {
        return new Promise((resolve) => {
          let oServiceInfo = {
            success: function (oData) {
              resolve(oData);
            },
            error: function (oError) {
              resolve(oError);
            }
          };
          oServiceInfo.filters =
            aFilters && aFilters.length > 0 ? aFilters : [];
          this.getMainModel().read(
            Constants.entity.TOR_PARAMETER_DESCView,
            oServiceInfo
          );
        });
      },
      getUserRoles: function () {
        return new Promise((resolve, reject) => {
          let oServiceInfo = {
            method: "POST",
            success: function (oData) {
              resolve(oData);
            },
            error: function (oError) {
              reject(oError);
            }
          };
          this.getUserRolesModel().read(
            Constants.entity.TOR_USER_ROLES,
            oServiceInfo
          );
        });
      }
    };
  },
  true
);
