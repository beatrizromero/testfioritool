// Define the SAP UI5 module with necessary dependencies
sap.ui.define(
  [
    "apptorparameters/controller/BaseController", // Custom router for navigation
    "apptorparameters/utils/Constants", // Constants used across the application
    "apptorparameters/utils/DataManager", // DataManager for handling data operations
    "apptorparameters/utils/Services", // Services for backend communication
    "apptorparameters/utils/Utils", // Utils for various utility functions
    "sap/m/MessageBox" // MessageBox for showing alerts and messages
  ],
  /**
   * Main function of the module.
   * @param {object} BaseController - SAP UI5 base controller class
   * @param {object} Constants - Reference to utils/Constants.js file
   * @param {object} DataManager - Reference to utils/DataManager.js file
   * @param {object} Services - Reference to utils/Services.js file
   * @param {object} Utils - Reference to utils/Utils.js file
   * @param {typeof sap.m.MessageBox} MessageBox - Dialogs for messages in the application
   * @returns {object} Extension of BaseController object
   */
  function (
    BaseController,
    Constants,
    DataManager,
    Services,
    Utils,
    MessageBox
  ) {
    "use strict";
    // Extend the custom Router for this specific controller
    return BaseController.extend("apptorparameters.controller.EditView", {
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
          .getRoute(Constants.route.EDIT_ROUTE)
          .attachMatched(this.onMatchedRouteDefault, this);
      },

      /** Handler for when the route is matched */
      onMatchedRouteDefault: function () {
        // Create a popover UI component
        Utils.createPopover(this, Constants.id.EDITVIEW_MESSAGEPOPOVER_ID);
        // Clear selection in the EditViewTable
        let EditViewTable = this.getView().byId(Constants.id.EDITVIEWTABLE_ID);
        EditViewTable.clearSelection();
        this.getMessageModel().setProperty("/", []);
        this.getMessageModel().refresh();
        this._activateDraftHandlingEdit();
      },

      /**
       * Handler for the 'Save Edit' button press
       * @param {object} oEvent - This object contains relevant information about the event that ocurred, such as the event type, the control that triggered the event, and any additional data associated
       */
      onPressSaveEditButton: function (oEvent) {
        this.oSaveEditButton = oEvent.getSource();
        // Get the EditViewTable and its selected indices
        let EditViewTable = this.getView().byId(Constants.id.EDITVIEWTABLE_ID);
        this.aIndices = EditViewTable.getSelectedIndices();
        // Validate if rows are selected, else show error message
        if (this.aIndices.length < 1) {
          let errorMessage = this.getView()
            .getModel(Constants.model.I18N_MODEL)
            .getResourceBundle()
            .getText("service.error.edit.norecords");
          this.getMessageModel().setProperty("/", [
            Utils.returnMessage(this, Constants.state.INFORMATION, errorMessage)
          ]);
          this.getMessageModel().refresh();
          this._openPopOverButton();
          return;
        }
        /** Continue with the edit process */
        this.oSaveEditButton.setBusy(true);
        this._editTorParameterTotalView(this.aIndices)
          .then(() => {
            let bEditTorParameter = true;
            this._liberateEditTorParameterTotalView(bEditTorParameter);
          })
          .catch((e) => {
            // On failure, show an error message
            if (e?.statusText) {
              this.getMessageModel()
                .getProperty("/")
                .push(
                  Utils.returnMessage(
                    this,
                    Constants.state.ERROR,
                    JSON.parse(e.responseText).error.message.value
                  )
                );
            } else {
              this.getMessageModel()
                .getProperty("/")
                .push(Utils.returnMessage(this, Constants.state.ERROR, ""));
            }
            this.getMessageModel().refresh();
            this._openPopOverButton();
          });
      },

      /**
       * Navigation button press handler
       * @param {object} oEvent - This object contains relevant information about the event that ocurred, such as the event type, the control that triggered the event, and any additional data associated
       */
      onNavButtonPress: function (oEvent) {
        //Preguntamos que si queremos salir sin guardar cambios y, después, liberamos el objeto a editar
        MessageBox.warning(
          this.getView()
            .getModel(Constants.model.I18N_MODEL)
            .getResourceBundle()
            .getText("editView.message.warningBack"),
          {
            actions: [MessageBox.Action.OK, MessageBox.Action.CLOSE],
            emphasizedAction: MessageBox.Action.OK,
            onClose: function (sAction) {
              if (sAction === MessageBox.Action.OK) {
                let bEditTorParameter = false;
                this.navButton = oEvent.getSource();
                this.navButton.setBusyIndicatorDelay(0);
                this.navButton.setBusy(true);
                this._liberateEditTorParameterTotalView(bEditTorParameter);
              }
            }.bind(this)
          }
        );
      },

      /** Function to open the Popover UI component */
      _openPopOverButton: function () {
        // Get the popover and open it by the specified button
        Utils.getPopover().openBy(
          this.getView().byId(Constants.id.EDITVIEW_MESSAGEPOPOVER_ID)
        );
      },

      /**
       * activate DraftHandling so that another user cannot edit
       */
      _activateDraftHandlingEdit: function () {
        let oItemsTable = this.getView()
          .getModel(Constants.model.LOCAL_MODEL)
          .getProperty(
            this.getView()
              .byId(Constants.id.EDITVIEWTABLE_ID)
              .getBinding()
              .getPath()
          );
        let oItemsTableIndex = [];
        oItemsTable.forEach((value, key) => {
          oItemsTableIndex.push(key);
        });
        this._draftEditTorParameterTotalView(oItemsTableIndex).catch((e) => {
          // On failure, show an error message
          let sError;
          if (e?.responseText) {
            sError = JSON.parse(e.responseText).error.message.value;
            this.getMessageModel()
              .getProperty("/")
              .push(Utils.returnMessage(this, Constants.state.ERROR, sError));
          } else {
            sError = Constants.state.ERROR;
            this.getMessageModel()
              .getProperty("/")
              .push(Utils.returnMessage(this, Constants.state.ERROR, ""));
          }
          this.getMessageModel().refresh();
          MessageBox.error(sError, {
            actions: [MessageBox.Action.CLOSE],
            onClose: function () {
              this.getRouter().navTo(Constants.route.TABLE_ROUTE);
            }.bind(this)
          });
        });
      },

      /**
       * disable DraftHandling so that another user can edit
       * @param {boolean} bEditTorParameter - Boolean parameter that tells us whether or not the lines in the view were edited to add them to the draft handling service.
       */
      _liberateEditTorParameterTotalView: function (bEditTorParameter) {
        let oItemsTableIndex = [];
        if (!bEditTorParameter) {
          let oItemsTable = this.getView()
            .getModel(Constants.model.LOCAL_MODEL)
            .getProperty(
              this.getView()
                .byId(Constants.id.EDITVIEWTABLE_ID)
                .getBinding()
                .getPath()
            );
          oItemsTable.forEach((value, key) => {
            oItemsTableIndex.push(key);
          });
        } else {
          oItemsTableIndex = this.aIndices;
        }
        //Continue with prepare draft process (draft prepare)
        this._prepareTorParameterTotalView(oItemsTableIndex)
          .then(() => {
            //Finish with activate draft process (draft activate)
            this._onStepActivateTorParameterTotalView(
              bEditTorParameter,
              oItemsTableIndex,
              this.getMessageModel()
            );
          })
          .catch((e) => {
            // On failure, show an error message
            if (e?.statusText) {
              this.getMessageModel()
                .getProperty("/")
                .push(
                  Utils.returnMessage(
                    this,
                    Constants.state.ERROR,
                    JSON.parse(e.responseText).error.message.value
                  )
                );
            } else {
              this.getMessageModel()
                .getProperty("/")
                .push(Utils.returnMessage(this, Constants.state.ERROR, ""));
            }
            this.getMessageModel().refresh();
            this._openPopOverButton();

            if (this.navButton) {
              this.navButton.setBusy(false);
            }
            if (this.oSaveEditButton) {
              this.oSaveEditButton.setBusy(false);
            }
          });
      },

      /**
       * Activate draft process
       * @param {boolean} bEditTorParameter - Boolean parameter that tells us whether or not the lines in the view were edited to add them to the draft handling service.
       * @param {Array} aItemsTableIndex - Array of parameters selected indices.
       * @param {object} messageModel - Model of popover messages.
       */
      _onStepActivateTorParameterTotalView: function (
        bEditTorParameter,
        aItemsTableIndex,
        messageModel
      ) {
        this._activateTorParameterTotalView(aItemsTableIndex)
          .then(() => {
            if (bEditTorParameter) {
              // On successful edit, show a success message and navigate to the Table route
              let successMessage = this.getView()
                .getModel(Constants.model.I18N_MODEL)
                .getResourceBundle()
                .getText("service.success.edit");
              messageModel.setProperty("/", [
                Utils.returnMessage(
                  this,
                  Constants.state.SUCCESS,
                  successMessage
                )
              ]);
              messageModel.refresh();
            }
            // Navigate to the table route
            this.getRouter().navTo(Constants.route.TABLE_ROUTE);
          })
          .catch((e) => {
            // On failure, show an error message
            if (e?.statusText) {
              messageModel
                .getProperty("/")
                .push(
                  Utils.returnMessage(
                    this,
                    Constants.state.ERROR,
                    JSON.parse(e.responseText).error.message.value
                  )
                );
            } else {
              messageModel
                .getProperty("/")
                .push(Utils.returnMessage(this, Constants.state.ERROR, ""));
            }
            messageModel.refresh();
            this._openPopOverButton();
          })
          .finally(() => {
            if (this.navButton) {
              this.navButton.setBusy(false);
            }
            if (this.oSaveEditButton) {
              this.oSaveEditButton.setBusy(false);
            }
          });
      },

      /**
       * Function to handle draft editing of TorParameterTotalView
       * @param {Array} aIndices - Array of parameters selected indices
       * @returns {object} Returns a promise object with all services calls for draft edit the descriptives fields of a parameter
       */
      _draftEditTorParameterTotalView: function (aIndices) {
        // Get the EditViewTable and the selected items
        let EditViewTable = this.getView().byId(Constants.id.EDITVIEWTABLE_ID);
        let aSelectedItems = [];
        // Loop through indices to get the selected items
        aIndices.forEach((value) => {
          aSelectedItems.push(
            EditViewTable.getContextByIndex(value).getObject()
          );
        });
        // Prepare promises for editing each selected item
        let pDraftEditTorParameterDescView = [];
        aSelectedItems.forEach((value) => {
          let draftEditParameter =
            Services.draftEditTorParameterDescView(value);
          pDraftEditTorParameterDescView.push(draftEditParameter);
        });
        // Wait for all edit operations to complete
        return Promise.all(pDraftEditTorParameterDescView);
      },

      /**
       * Prepare promises to edit each selected item
       * @param {Array} aIndices - Array of parameters selected indices
       * @returns {object} Returns a promise object with all services calls for edit the descriptives fields of a parameter
       */
      _editTorParameterTotalView: function (aIndices) {
        // Get the EditViewTable and the selected items
        let EditViewTable = this.getView().byId(Constants.id.EDITVIEWTABLE_ID);
        let aSelectedItems = [];
        // Loop through indices to get the selected items
        aIndices.forEach((value) => {
          aSelectedItems.push(
            EditViewTable.getContextByIndex(value).getObject()
          );
        });
        // Prepare promises for editing each selected item
        let pEditTorParameterDescView = [];
        aSelectedItems.forEach((value) => {
          let editParameter = Services.editTorParameterDescView(value, value);
          pEditTorParameterDescView.push(editParameter);
        });
        // Wait for all edit operations to complete
        return Promise.all(pEditTorParameterDescView);
      },

      /**
       * Prepare promises for editing each selected item
       * @param {Array} aIndices - Array of parameters selected indices
       * @returns {object} Returns a promise object with all services calls for draft prepare the descriptives fields of a parameter
       */
      _prepareTorParameterTotalView: function (aIndices) {
        // Get the EditViewTable and the selected items
        let EditViewTable = this.getView().byId(Constants.id.EDITVIEWTABLE_ID);
        let aSelectedItems = [];
        // Loop through indices to get the selected items
        aIndices.forEach((value) => {
          aSelectedItems.push(
            EditViewTable.getContextByIndex(value).getObject()
          );
        });
        // Prepare promises for editing each selected item
        let pPrepareTorParameterDescView = [];
        aSelectedItems.forEach((value) => {
          let prepareParameter = Services.prepareTorParameterDescView(
            value,
            value
          );
          pPrepareTorParameterDescView.push(prepareParameter);
        });
        // Wait for all edit operations to complete
        return Promise.all(pPrepareTorParameterDescView);
      },

      /**
       * Prepare promises for editing each selected item
       * @param {Array} aIndices - Array of parameters selected indices
       * @returns {object} Returns a promise object with all services calls for draft activate the descriptives fields of a parameter
       */
      _activateTorParameterTotalView: function (aIndices) {
        // Get the EditViewTable and the selected items
        let EditViewTable = this.getView().byId(Constants.id.EDITVIEWTABLE_ID);
        let aSelectedItems = [];
        // Loop through indices to get the selected items
        aIndices.forEach((value) => {
          aSelectedItems.push(
            EditViewTable.getContextByIndex(value).getObject()
          );
        });
        // Prepare promises for editing each selected item
        let pActivateTorParameterDescView = [];
        aSelectedItems.forEach((value) => {
          let prepareParameter = Services.activateTorParameterDescView(
            value,
            value
          );
          pActivateTorParameterDescView.push(prepareParameter);
        });
        // Wait for all edit operations to complete
        return Promise.all(pActivateTorParameterDescView);
      }
    });
  }
);
