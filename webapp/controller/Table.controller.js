sap.ui.define(
  [
    "apptorparameters/controller/BaseController",
    "apptorparameters/utils/Constants",
    "apptorparameters/utils/DataManager",
    "apptorparameters/utils/Services",
    "apptorparameters/utils/Utils",
    "sap/m/MessageBox"
  ],
  /**
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
    return BaseController.extend("apptorparameters.controller.Table", {
      utils: Utils,

      /** Lifecycle hook for initialization */
      onInit: function () {
        this.isEditUser();
        this.getRouter()
          .getRoute(Constants.route.TABLE_ROUTE)
          .attachMatched(this.onMatchedRouteDefault, this);
      },

      /** Handler for when the route is matched */
      onMatchedRouteDefault: function () {
        // For creation of the Message Channel for Errors we pass the context and the Id of the Message Popover
        Utils.createPopover(this, Constants.id.TABLEVIEW_MESSAGEPOPOVER_ID);
        let TableViewTable = this.getView().byId(Constants.id.TABLEVIEW_ID);
        TableViewTable.clearSelection();
        this.checkSearchTable();
      },

      /** Function that checks if there are filter parameters in the filter bar entries to call the service that returns the list of parameters. */
      checkSearchTable: function () {
        let aFilters = DataManager.getParameterFilters();
        let oDataModel = this.getView().getModel(Constants.model.LOCAL_MODEL);
        let aTable =
          oDataModel.getProperty(Constants.property.PARAMETERTABLE_PROPERTY) ||
          [];
        if (!aFilters.length && !aTable.length) {
          return;
        }
        this.refreshTable();
      },

      /** Function to update parameter list data */
      refreshTable: function () {
        let aFilters = DataManager.getParameterFilters();
        let localModel = this.getView().getModel(Constants.model.LOCAL_MODEL);
        let TableViewTable = this.getView().byId(Constants.id.TABLEVIEW_ID);
        TableViewTable.setBusy(true);
        Services.readTorParameterTotalView(aFilters)
          .then((oData) => {
            localModel.setProperty(
              Constants.property.PARAMETERTABLE_PROPERTY,
              oData
            );
          })
          .catch((oError) => {
            if (oError?.results && oError.results.length == 0) {
              let errorMessage = this.getView()
                .getModel(Constants.model.I18N_MODEL)
                .getResourceBundle()
                .getText("service.error.nodata");
              localModel.setProperty(
                Constants.property.PARAMETERTABLE_PROPERTY,
                []
              );
              this.getMessageModel().setProperty("/", [
                Utils.returnMessage(this, Constants.state.ERROR, errorMessage)
              ]);
              this.openPopOverButton();
            }
          })
          .finally(() => {
            TableViewTable.setBusy(false);
          });
      },

      /** Function for event create press button */
      onPressCreateButton: function () {
        this.getMessageModel().setProperty("/", []);
        this.getMessageModel().refresh();
        this.getView()
          .getModel(Constants.model.LOCAL_MODEL)
          .setProperty(Constants.property.CREATE_BINDING, [
            { descriptions: [{}] }
          ]);
        this.getOwnerComponent()
          .getRouter()
          .navTo(Constants.route.CREATE_ROUTE);
      },

      /** Function for event edit press button */
      onPressEditButton: function () {
        let localModel = this.getView().getModel(Constants.model.LOCAL_MODEL);
        let TableViewTable = this.getView().byId(Constants.id.TABLEVIEW_ID);
        let aIndices = TableViewTable.getSelectedIndices();
        let aSelectedItems = [];
        if (aIndices.length < 1) {
          let errorMessage = this.getView()
            .getModel(Constants.model.I18N_MODEL)
            .getResourceBundle()
            .getText("service.error.edit.norecords");
          this.getMessageModel().setProperty("/", [
            Utils.returnMessage(this, Constants.state.INFORMATION, errorMessage)
          ]);
          this.openPopOverButton();
          return;
        }
        aIndices.forEach((value) => {
          aSelectedItems.push(
            TableViewTable.getContextByIndex(value).getObject()
          );
        });
        localModel.setProperty(
          Constants.property.EDIT_BINDING,
          JSON.parse(JSON.stringify(aSelectedItems))
        );
        this.getOwnerComponent().getRouter().navTo(Constants.route.EDIT_ROUTE);
        this.getMessageModel().setProperty("/", []);
        this.getMessageModel().refresh();
      },

      /** Function for open popover messages */
      openPopOverButton: function () {
        Utils.getPopover().openBy(
          this.getView().byId(Constants.id.TABLEVIEW_MESSAGEPOPOVER_ID)
        );
      },

      /** Function for event delete press button. */
      onPressDeleteButton: function () {
        this.getMessageModel().setProperty("/", []);
        this.getMessageModel().refresh();
        let TableViewTable = this.getView().byId(Constants.id.TABLEVIEW_ID);
        if (TableViewTable.getSelectedIndices().length < 1) {
          let errorMessage = this.getView()
            .getModel(Constants.model.I18N_MODEL)
            .getResourceBundle()
            .getText("service.error.delete.norecords");
          this.getMessageModel().setProperty("/", [
            Utils.returnMessage(this, Constants.state.INFORMATION, errorMessage)
          ]);
          this.openPopOverButton();
          return;
        }
        TableViewTable.setBusy(true);
        this._validateDeleteAction().then(() => {
          this._deleteTorParameterTotalView();
        });
      },

      onValueHelpRequestParameterType: function (oEvent) {
        let sID = oEvent.getSource();
        Utils._getCreateFragmentValueHelp
          .bind(this)(sID, "ParameterType")
          .open();
        Services.readTorParameterTotalView([]).then((oData) => {
          let sFilterLang;
          let sLangValue = this.getView()
            .getModel(Constants.model.LOCAL_MODEL)
            .getProperty(
              `${Constants.property.MAIN_BINDING}${Constants.property.LANGUAGE_CODE}`
            );
          if (sLangValue) {
            sFilterLang = sLangValue;
          } else {
            let sLanguage = sap.ui.getCore().getConfiguration().getLanguage();
            sFilterLang = sLanguage.substring(0, 2).toUpperCase();
          }
          let oResults = Object.values(
            oData.reduce((r, o) => {
              if (sFilterLang === o.lang) {
                r[o.param] = o;
              }
              return r;
            }, {})
          );
          this.getView()
            .getModel(Constants.model.LOCAL_MODEL)
            .setProperty(Constants.property.PARAMETERTYPE_PROPERTY, oResults);
          let oSelect = sap.ui.getCore().byId(Constants.id.PARAMETER_TYPE_ID); //get the reference to your Select control
          let oBinding = oSelect.getBinding(Constants.parametersOEvent.ITEMS);
          let aFilters = [];
          aFilters.push(
            new sap.ui.model.Filter(
              Constants.filterKeyPath.LANG,
              sap.ui.model.FilterOperator.EQ,
              sFilterLang.toUpperCase()
            )
          );
          oBinding.filter(aFilters); //apply the filter
        });
      },

      onExit: function () {
        this.destroy();
        Utils.setPopover(undefined);
      },

      /**
       * Function to validate delete action.
       * @returns {object} Return a promise that check if the deletion has been confirmed or not with boolean value
       */
      _validateDeleteAction: function () {
        return new Promise((resolve, reject) => {
          MessageBox.confirm(
            this.getView()
              .getModel(Constants.model.I18N_MODEL)
              .getResourceBundle()
              .getText("service.error.delete.confirmation"),
            {
              actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
              emphasizedAction: MessageBox.Action.OK,
              onClose: function (sAction) {
                if (sAction == "OK") {
                  resolve(sAction);
                } else {
                  reject(sAction);
                }
              }
            }
          );
        });
      },

      /**
       * Function to delete TOR Parameter.
       */
      _deleteTorParameterTotalView: function () {
        let TableViewTable = this.getView().byId(Constants.id.TABLEVIEW_ID);
        let aItems = TableViewTable.getSelectedIndices();
        let aDeleteTorParameterView = DataManager.deleteTorParameterDescView(
          aItems,
          TableViewTable
        );
        let pDleteTorParameterView = [];
        this.iCountDelete = 0;
        for (let row of aDeleteTorParameterView) {
          let getReadTorParameterDescViewFilters =
            DataManager.getReadTorParameterDescViewFilters(row);
          Services.readFilterTorParameterDescView(
            getReadTorParameterDescViewFilters
          ).then(
            function (oData) {
              this.iCountDelete++;
              if (oData?.results && oData.results.length === 1) {
                pDleteTorParameterView.push(
                  Services.deleteTorParameterView(row)
                );
              }
              pDleteTorParameterView.push(
                Services.deleteTorParameterDescView(row)
              );
              if (this.iCountDelete === aDeleteTorParameterView.length) {
                Promise.all(pDleteTorParameterView)
                  .then(() => {
                    this.refreshTable();
                    let successMessage = this.getView()
                      .getModel(Constants.model.I18N_MODEL)
                      .getResourceBundle()
                      .getText("service.success.delete");
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
                    this.openPopOverButton();
                  })
                  .catch((e) => {
                    if (e?.statusText) {
                      this.getMessageModel()
                        .getProperty("/")
                        .push(
                          Utils.returnMessage(
                            this,
                            Constants.state.ERROR,
                            e.statusText
                          )
                        );
                      this.getMessageModel().refresh();
                      this.openPopOverButton();
                    }
                  })
                  .finally(() => {
                    TableViewTable.setBusy(false);
                  });
              }
            }.bind(this)
          );
        }
      }
    });
  }
);
