sap.ui.define(
  [
    "apptorparameters/controller/BaseController", // Custom router for navigation
    "apptorparameters/utils/Constants", // Constants used across the application
    "apptorparameters/utils/DataManager", // DataManager for handling data operations
    "apptorparameters/utils/Services", // Services for backend communication
    "apptorparameters/utils/Utils" // Utils for various utility functions
  ],
  /**
   * Main function of the module.
   * @param {object} BaseController - SAP UI5 base controller class
   * @param {object} Constants - Reference to utils/Constants.js file
   * @param {object} DataManager - Reference to utils/DataManager.js file
   * @param {object} Services - Reference to utils/Services.js file
   * @param {object} Utils - Reference to utils/Utils.js file
   * @returns {object} Extension of BaseController object
   */
  function (BaseController, Constants, DataManager, Services, Utils) {
    "use strict";
    // Extend the custom Router for this specific controller
    return BaseController.extend("apptorparameters.controller.CreateView", {
      /** Lifecycle hook for initialization */
      onInit: function () {
        if (
          this.getOwnerComponent()
            .getModel(Constants.model.ROLES_MODEL)
            .getProperty(Constants.property.IS_EDIT_USER) === undefined
        ) {
          this.isEditUser();
        }
        // Attach a route matched event for a specific route
        this.getRouter()
          .getRoute(Constants.route.CREATE_ROUTE)
          .attachMatched(this.onMatchedRouteDefault, this);
      },

      /** Handler for when the route is matched */
      onMatchedRouteDefault: function () {
        // Create a popover UI component
        Utils.createPopover(this, Constants.id.CREATEVIEW_MESSAGEPOPOVER_ID);
      },

      /** Function to add a new row in the UI */
      onPressAddRow: function () {
        // Get the local model and the binding path for creating data
        let localModel = this.getView().getModel(Constants.model.LOCAL_MODEL);
        let aCreateBinding = localModel.getProperty(
          Constants.property.CREATE_BINDING
        );
        // Add a new empty object (row) to the data binding
        aCreateBinding.push({ descriptions: [{}] });
        // Refresh the model to update the UI
        localModel.refresh();
      },

      /**
       * Function to handle the 'Create' button press
       * @param {object} oEvent - This object contains relevant information about the event that ocurred, such as the event type, the control that triggered the event, and any additional data associated
       */
      onPressCreateButton: function (oEvent) {
        // Retrieve various models and data required for creation
        let localModel = this.getView()
          .getModel(Constants.model.LOCAL_MODEL)
          .getProperty(Constants.property.CREATE_BINDING);
        let breakpoint;
        this.getView()
          .getModel(Constants.model.LOCAL_MODEL)
          .setProperty(Constants.property.CREATE_ERROR_MESSAGE, false);
        // Iterate over the model data to check for missing fields
        localModel.forEach((value) => {
          if (
            !value.param ||
            !value.param_value ||
            !this._checkDescriptions(value.descriptions)
          ) {
            breakpoint = true;
          }
        });
        // If any field is missing, show an error message and stop the process
        if (breakpoint) {
          let successMessage = this.getView()
            .getModel(Constants.model.I18N_MODEL)
            .getResourceBundle()
            .getText("service.error.create.missingData");
          this.getMessageModel().setProperty("/", [
            Utils.returnMessage(
              this,
              Constants.state.INFORMATION,
              successMessage
            )
          ]);
          this._openPopOverButton();
          return;
        }
        // If all fields are filled, proceed with creation
        oEvent.getSource().setBusy(true);
        this._createTorParameterTotalView();
      },

      /**
       * Execute when press description button
       * @param {object} oEvent - This object contains relevant information about the event that ocurred, such as the event type, the control that triggered the event, and any additional data associated
       */
      onBtnPressDescription: function (oEvent) {
        let oSelectedDescription = oEvent
          .getSource()
          .getBindingContext(Constants.model.LOCAL_MODEL)
          .getObject();
        this.getView()
          .getModel(Constants.model.LOCAL_MODEL)
          .setProperty(
            Constants.property.SELECTEDDESCRIPTION_PROPERTY,
            oSelectedDescription
          );
        this._oDescriptionData = sap.ui.xmlfragment(
          "apptorparameters.view.fragment.DescriptionDataDialog",
          this
        );
        this.getView().addDependent(this._oDescriptionData);
        this._oDescriptionData.attachAfterClose(
          null,
          function () {
            this._oDescriptionData.destroy();
            this._oDescriptionData = undefined;
            delete this._oDescriptionData;
          },
          this
        );
        this._oDescriptionData.open();
      },

      /**
       * used to add one more row to the descriptions dialog when creating parameters
       */
      onPressAddRowDescriptions: function () {
        let oDataModel = this.getView().getModel(Constants.model.LOCAL_MODEL);
        let aCreateBinding = oDataModel.getProperty(
          Constants.property.SELECTEDDESCRIPTION_DESCRIPTIONS_PROPERTY
        );
        aCreateBinding.push({});
        oDataModel.refresh();
      },

      /**
       * It is executed when you press the confirmation button in the dialog and calls the function "_onCloseDataOrderDialog()"
       */
      onBtnPressConfirmOrderData: function () {
        this._onCloseDataOrderDialog();
      },

      /**
       * It is executed when you press the cancel button in the dialog and calls the function "_onCloseDataOrderDialog()"
       */
      onBtnPressCancelOrderData: function () {
        this._onCloseDataOrderDialog();
      },

      /**
       * Save id from selected elements  material table
       * @param {object} oEvent - This object contains relevant information about the event that ocurred, such as the event type, the control that triggered the event, and any additional data associated
       */
      onSelectedParentRowDescription: function (oEvent) {
        let aSelectedIndices = oEvent.getSource().getSelectedIndices();
        let oModel = this.getView().getModel(Constants.model.LOCAL_MODEL);
        let aSelectedItems = [];
        aSelectedIndices.forEach((iIndex) => {
          aSelectedItems.push(iIndex);
        });
        oModel.setProperty(
          Constants.property.SELECTEDPARENTROWDESCRIPTION,
          aSelectedItems
        );
      },

      /** Delete elements from material table */
      onPressDeleteDescriptionsButton: function () {
        let oModel = this.getView().getModel(Constants.model.LOCAL_MODEL);
        let aMaterialTable = oModel.getProperty(
          Constants.property.SELECTEDDESCRIPTION_DESCRIPTIONS_PROPERTY
        );
        let aIndices = oModel.getProperty(
          Constants.property.SELECTEDPARENTROWDESCRIPTION
        );
        aMaterialTable = aMaterialTable.filter((oElement, iIndex) => {
          return !aIndices.includes(iIndex);
        });
        oModel.setProperty(
          Constants.property.SELECTEDDESCRIPTION_DESCRIPTIONS_PROPERTY,
          aMaterialTable
        );
        oModel.setProperty(Constants.property.SELECTEDPARENTROWDESCRIPTION, []);
      },

      /**
       * Save id from selected elements  material table
       * @param {object} oEvent - This object contains relevant information about the event that ocurred, such as the event type, the control that triggered the event, and any additional data associated
       */
      onSelectedParentRow: function (oEvent) {
        let aSelectedIndices = oEvent.getSource().getSelectedIndices();
        let oModel = this.getView().getModel(Constants.model.LOCAL_MODEL);
        let aSelectedItems = [];
        aSelectedIndices.forEach((iIndex) => {
          aSelectedItems.push(iIndex);
        });
        oModel.setProperty(
          Constants.property.SELECTEDPARENTROW,
          aSelectedItems
        );
      },

      /** Delete elements from material table*/
      onPressDeleteButton: function () {
        let oModel = this.getView().getModel(Constants.model.LOCAL_MODEL);
        let aMaterialTable = oModel.getProperty(
          Constants.property.CREATE_BINDING
        );
        let aIndices = oModel.getProperty(Constants.property.SELECTEDPARENTROW);
        aMaterialTable = aMaterialTable.filter((oElement, iIndex) => {
          return !aIndices.includes(iIndex);
        });
        oModel.setProperty(Constants.property.CREATE_BINDING, aMaterialTable);
        oModel.setProperty(Constants.property.SELECTEDPARENTROW, []);
      },

      /** Navigation button press handler */
      onNavButtonPress: function () {
        // Navigate to the table route
        this.getRouter().navTo(Constants.route.TABLE_ROUTE);
      },

      /**
       * close the descriptions dialog
       */
      _onCloseDataOrderDialog: function () {
        this._oDescriptionData.close();
      },

      /**
       * This function is used to ensure that all descriptions in the array meet certain specific criteria
       * @param {Array} aDescriptions - Array descriptions to checking
       * @returns {boolean} Boolean that returns true if the descriptive check is successful and false if the descriptive check is incorrect
       */
      _checkDescriptions: function (aDescriptions) {
        for (const element of aDescriptions) {
          if (element.param_value_desc && !element.lang) {
            return false;
          }
        }
        return true;
      },

      /** Function to open the Popover UI component */
      _openPopOverButton: function () {
        // Get the popover and open it by the specified button
        Utils.getPopover().openBy(
          this.getView().byId(Constants.id.CREATEVIEW_MESSAGEPOPOVER_ID)
        );
      },

      /**
       * Function to handle creation of TorParameterTotalView
       */
      _createTorParameterTotalView: function () {
        // Create and handle promises for asynchronous operations
        let aCreateTorParameterView = DataManager.createTorParameterView();
        let aCreateTorParameterDescView =
          DataManager.createTorParameterDescView();
        // Process each row in the Tor Parameter View
        this._checkingExistParam(
          aCreateTorParameterView,
          aCreateTorParameterDescView
        );
      },

      /**
       * Function to checking if param exist
       * @param {Array} aCreateTorParameterView - Array of params
       * @param {Array} aCreateTorParameterDescView - Array of params descriptions
       */
      _checkingExistParam: function (
        aCreateTorParameterView,
        aCreateTorParameterDescView
      ) {
        let iCountParams = 0;
        this.pCreateTorParameter = [];
        for (let row of aCreateTorParameterView) {
          Services.readTorParameterView(row)
            .then(
              function (oData) {
                iCountParams++;
                // Create new entries if they don't exist
                if (oData.statusCode === 404) {
                  this.pCreateTorParameter.push(
                    Services.createTorParameterView(row)
                  );
                }
                let aCheckDescr = aCreateTorParameterDescView.filter(
                  (oCheck) => {
                    return (
                      oCheck.param === row.param &&
                      oCheck.param_value === row.param_value
                    );
                  }
                );
                if (!aCheckDescr.length) {
                  let sErrorMessage = this.getView()
                    .getModel(Constants.model.I18N_MODEL)
                    .getResourceBundle()
                    .getText("service.error.create", [oData.param]);
                  this.getMessageModel()
                    .getProperty("/")
                    .push(
                      Utils.returnMessage(
                        this,
                        Constants.state.ERROR,
                        sErrorMessage
                      )
                    );
                  this.getView()
                    .getModel(Constants.model.LOCAL_MODEL)
                    .setProperty(Constants.property.CREATE_ERROR_MESSAGE, true);
                }
                if (iCountParams === aCreateTorParameterView.length) {
                  // Repeat the process for TorParameterDescView
                  this._checkingExistParamDesc(aCreateTorParameterDescView);
                }
              }.bind(this)
            )
            .catch(
              function (e) {
                // On failure, show an error message
                let errorMessage = JSON.parse(e.responseText).error.message
                  .value;
                this.getMessageModel().setProperty("/", [
                  Utils.returnMessage(this, Constants.state.ERROR, errorMessage)
                ]);
                this.getView().byId("saveButton").setBusy(false);
                iCountParams++;
                if (iCountParams === aCreateTorParameterView.length) {
                  // Repeat the process for TorParameterDescView
                  this._checkingExistParamDesc(aCreateTorParameterDescView);
                }
              }.bind(this)
            );
        }
      },

      /**
       * Function to checking if param desc exist
       * @param {Array} aCreateTorParameterDescView - Array of params descriptions
       */
      _checkingExistParamDesc: function (aCreateTorParameterDescView) {
        let iCountParamsDesc = 0;
        this.aExistParamsDesc = [];
        for (let row of aCreateTorParameterDescView) {
          Services.readTorParameterDescView(row)
            .then(
              function (oData) {
                iCountParamsDesc++;
                // Create new entries if they don't exist
                if (oData.statusCode === 404) {
                  this.pCreateTorParameter.push(
                    Services.createTorParameterDescView(row)
                  );
                } else {
                  let sErrorMessage = this.getView()
                    .getModel(Constants.model.I18N_MODEL)
                    .getResourceBundle()
                    .getText("service.error.create.description", [oData.param]);
                  this.getMessageModel()
                    .getProperty("/")
                    .push(
                      Utils.returnMessage(
                        this,
                        Constants.state.ERROR,
                        sErrorMessage
                      )
                    );
                  this.getView()
                    .getModel(Constants.model.LOCAL_MODEL)
                    .setProperty(Constants.property.CREATE_ERROR_MESSAGE, true);
                }
                if (iCountParamsDesc === aCreateTorParameterDescView.length) {
                  this._promiseAllCreateTorParameter(this.pCreateTorParameter);
                }
              }.bind(this)
            )
            .catch(
              function (e) {
                // On failure, show an error message
                let errorMessage = JSON.parse(e.responseText).error.message
                  .value;
                this.getMessageModel().setProperty("/", [
                  Utils.returnMessage(this, Constants.state.ERROR, errorMessage)
                ]);
                iCountParamsDesc++;
                if (iCountParamsDesc === aCreateTorParameterDescView.length) {
                  this._promiseAllCreateTorParameter(this.pCreateTorParameter);
                }
              }.bind(this)
            );
        }
      },

      /**
       * Promise with all calls of service, one for each new record
       * @param {Array} pCreateTorParameter - Array of promises to create params and descriptions of params
       */
      _promiseAllCreateTorParameter: function (pCreateTorParameter) {
        if (pCreateTorParameter.length > 0) {
          Promise.all(pCreateTorParameter)
            .then((oDataCreate) => {
              // On successful creation, show a success message and call prepare and activate service for draft handling
              let bErrorMessage = this.getView()
                .getModel(Constants.model.LOCAL_MODEL)
                .getProperty(Constants.property.CREATE_ERROR_MESSAGE);
              this.getMessageModel().refresh();
              if (!bErrorMessage) {
                this.iCountCreate = 0;
                let iLengthDataCreate = oDataCreate.length;
                for (const element of oDataCreate) {
                  if (element.lang === undefined) {
                    this._prepareActivateTorParameterView(
                      element,
                      iLengthDataCreate
                    );
                  } else {
                    this._prepareActivateTorParameterDescView(
                      element,
                      iLengthDataCreate
                    );
                  }
                }
              }
            })
            .catch((e) => {
              // On failure, show an error message
              let errorMessage = JSON.parse(e.responseText).error.message.value;
              this.getMessageModel().setProperty("/", [
                Utils.returnMessage(this, Constants.state.ERROR, errorMessage)
              ]);
              this.getView().byId("saveButton").setBusy(false);
            });
        }
      },

      /**
       * Function to handle prepare draft handling of TorParameterView
       * @param {object} element - Object to send for the service
       * @param {number} iLengthDataCreate - Length of the array of records to be sent by the service
       */
      _prepareActivateTorParameterView: function (element, iLengthDataCreate) {
        //TOR_PARAMETERView draft call
        //call services prepare for draft handling
        Services.prepareTorParameterView(element)
          .then((oData) => {
            //call services activate for draft handling
            let oCreate = {
              param: oData.param,
              param_value: oData.param_value
            };
            Services.activateTorParameterView(oCreate)
              .then(() => {
                this.iCountCreate++;
                let successMessage = this.getView()
                  .getModel(Constants.model.I18N_MODEL)
                  .getResourceBundle()
                  .getText("service.success.create");
                this.getMessageModel()
                  .getProperty("/")
                  .push(
                    Utils.returnMessage(
                      this,
                      Constants.state.SUCCESS,
                      successMessage
                    )
                  );
                this.getMessageModel().refresh();
                if (this.iCountCreate === iLengthDataCreate) {
                  this.getRouter().navTo(Constants.route.TABLE_ROUTE);
                }
              })
              .catch((e) => {
                // On failure, show an error message
                let errorMessage = JSON.parse(e.responseText).error.message
                  .value;
                this.getMessageModel()
                  .getProperty("/")
                  .push(
                    Utils.returnMessage(
                      this,
                      Constants.state.ERROR,
                      errorMessage
                    )
                  );
                this.getMessageModel().refresh();
              })
              .finally(() => {
                this.getView().byId("saveButton").setBusy(false);
              });
          })
          .catch((e) => {
            // On failure, show an error message
            let errorMessage = JSON.parse(e.responseText).error.message.value;
            this.getMessageModel()
              .getProperty("/")
              .push(
                Utils.returnMessage(this, Constants.state.ERROR, errorMessage)
              );
            this.getMessageModel().refresh();
            this.getView().byId("saveButton").setBusy(false);
          });
      },

      /**
       * Function to handle prepare draft handling of TorParameterDescView
       * @param {object} element - Object to send for the service
       * @param {number} iLengthDataCreate - Length of the array of records to be sent by the service
       */
      _prepareActivateTorParameterDescView: function (
        element,
        iLengthDataCreate
      ) {
        //TOR_PARAMETER_DESCView draft call
        //call services prepare for draft handling
        Services.prepareTorParameterDescView(element)
          .then((oData) => {
            //call services activate for draft handling
            let oCreate = {
              param: oData.param,
              param_value: oData.param_value,
              lang: oData.lang
            };
            Services.activateTorParameterDescView(oCreate)
              .then(() => {
                this.iCountCreate++;
                let successMessage = this.getView()
                  .getModel(Constants.model.I18N_MODEL)
                  .getResourceBundle()
                  .getText("service.success.create");
                this.getMessageModel()
                  .getProperty("/")
                  .push(
                    Utils.returnMessage(
                      this,
                      Constants.state.SUCCESS,
                      successMessage
                    )
                  );
                this.getMessageModel().refresh();
                if (this.iCountCreate === iLengthDataCreate) {
                  this.getRouter().navTo(Constants.route.TABLE_ROUTE);
                }
              })
              .catch((e) => {
                // On failure, show an error message
                let errorMessage = JSON.parse(e.responseText).error.message
                  .value;
                this.getMessageModel()
                  .getProperty("/")
                  .push(
                    Utils.returnMessage(
                      this,
                      Constants.state.ERROR,
                      errorMessage
                    )
                  );
                this.getMessageModel().refresh();
              })
              .finally(() => {
                this.getView().byId("saveButton").setBusy(false);
              });
          })
          .catch((e) => {
            // On failure, show an error message
            let errorMessage = JSON.parse(e.responseText).error.message.value;
            this.getMessageModel()
              .getProperty("/")
              .push(
                Utils.returnMessage(this, Constants.state.ERROR, errorMessage)
              );
            this.getMessageModel().refresh();
            this.getView().byId("saveButton").getSource().setBusy(false);
          });
      }
    });
  }
);
