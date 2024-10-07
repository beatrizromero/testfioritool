sap.ui.define(["apptorparameters/utils/Constants"], function (Constants) {
  "use strict";
  return {
    /**
     * set the local model
     * @param {object} oModel - Model object 'localModel'
     */
    setLocalModel: function (oModel) {
      this.oLocalModel = oModel;
    },

    /**
     * get the local model
     * @returns {object} Returns Local model object
     */
    getLocalModel: function () {
      return this.oLocalModel;
    },

    /**
     * get the parameters of the filters to call the parameter display service
     * @returns {Array} Returns array filters from filterbar and managed on this function
     */
    getParameterFilters: function () {
      let searchParam;
      let filters = [];
      searchParam = this.getLocalModel().getProperty(
        Constants.property.MAIN_BINDING
      );
      if (searchParam.parameterType && searchParam.parameterType.length > 0) {
        filters.push(
          new sap.ui.model.Filter({
            path: Constants.property.PARAM_PROPERTY,
            operator: sap.ui.model.FilterOperator.Contains,
            value1: searchParam.parameterType,
            caseSensitive: false
          })
        );
      }
      if (searchParam.parameterValue && searchParam.parameterValue.length > 0) {
        filters.push(
          new sap.ui.model.Filter({
            path: Constants.property.PARAM_VALUE_PROPERTY,
            operator: sap.ui.model.FilterOperator.Contains,
            value1: searchParam.parameterValue,
            caseSensitive: false
          })
        );
      }
      if (
        searchParam.parameterValueDescription &&
        searchParam.parameterValueDescription.length > 0
      ) {
        filters.push(
          new sap.ui.model.Filter({
            path: Constants.property.PARAM_VALUE_DESC_PROPERTY,
            operator: sap.ui.model.FilterOperator.Contains,
            value1: searchParam.parameterValueDescription,
            caseSensitive: false
          })
        );
      }
      if (searchParam.languageCode && searchParam.languageCode.length > 0) {
        filters.push(
          new sap.ui.model.Filter({
            path: Constants.property.LANG_PROPERTY,
            operator: sap.ui.model.FilterOperator.Contains,
            value1: searchParam.languageCode,
            caseSensitive: false
          })
        );
      }
      return filters;
    },

    /**
     * takes the parameters to call the parameters description display service
     * @param {object} oItem - Parameter item selected in the parameter list
     * @returns {Array} Returns array filters from filterbar and managed on this function
     */
    getReadTorParameterDescViewFilters: function (oItem) {
      let filters = [];
      if (oItem.param && oItem.param.length > 0) {
        filters.push(
          new sap.ui.model.Filter({
            path: Constants.property.PARAM_PROPERTY,
            operator: sap.ui.model.FilterOperator.Contains,
            value1: oItem.param,
            caseSensitive: false
          })
        );
      }
      if (oItem.param_value && oItem.param_value.length > 0) {
        filters.push(
          new sap.ui.model.Filter({
            path: Constants.property.PARAM_VALUE_PROPERTY,
            operator: sap.ui.model.FilterOperator.Contains,
            value1: oItem.param_value,
            caseSensitive: false
          })
        );
      }
      return filters;
    },

    /**
     * takes the parameters to call the parameter creation service
     * @returns {Array} Returns array for create paramater action managed on this function
     */
    createTorParameterView: function () {
      let aCreateBinding = this.getLocalModel().getProperty(
        Constants.property.CREATE_BINDING
      );
      let aCreate = [];
      aCreateBinding.forEach((value) => {
        if (
          value.param &&
          value.param_value &&
          value.param.length > 0 &&
          value.param_value.length > 0
        ) {
          aCreate.push({
            param: value.param,
            param_value: value.param_value
          });
        }
      });
      return aCreate;
    },

    /**
     * takes the parameters to call the parameter description creation service
     * @returns {Array} Returns array for create parameter descriptions action managed on this function
     */
    createTorParameterDescView: function () {
      let aCreateBinding = this.getLocalModel().getProperty(
        Constants.property.CREATE_BINDING
      );
      let aCreate = [];
      aCreateBinding.forEach((value) => {
        value.descriptions.forEach((oDescription) => {
          if (value.param && value.param_value && oDescription.lang) {
            aCreate.push({
              param: value.param,
              param_value: value.param_value,
              lang: oDescription.lang,
              param_value_desc: oDescription.param_value_desc
            });
          }
        });
      });
      return aCreate;
    },

    /**
     * takes the parameters to call the parameter daletion service
     * @param {object} aItems - Array for parameters items selected in the parameter list
     * @param {object} table - Object with table properties
     * @returns {Array} Returns array for delete parameter action managed on this function
     */
    deleteTorParameterView: function (aItems, table) {
      let aDelete = [];
      aItems.forEach((oItem) => {
        let value = table.getContextByIndex(oItem).getObject();
        if (
          value.param &&
          value.param_value &&
          value.param.length > 0 &&
          value.param_value.length > 0
        ) {
          aDelete.push({
            param: value.param,
            param_value: value.param_value
          });
        }
      });
      return aDelete;
    },

    /**
     * takes the parameters to call the parameter description daletion service
     * @param {object} aItems - Array for parameters items selected in the parameter list
     * @param {object} table - Object with table properties
     * @returns {Array} Returns array for delete parameter descriptions action managed on this function
     */
    deleteTorParameterDescView: function (aItems, table) {
      let aDelete = [];
      aItems.forEach((oItem) => {
        let value = table.getContextByIndex(oItem).getObject();
        aDelete.push({
          param: value.param,
          param_value: value.param_value,
          lang: value.lang || Constants.EMPTY
        });
      });
      return aDelete;
    },

    /**
     * takes the parameters to call the parameter description edition service
     * @returns {Array} Returns array for edit parameter descriptions action managed on this function
     */
    editTorParameterDescView: function () {
      let originalTable = this.getLocalModel().getProperty(
        Constants.property.TABLE_BINBINDG
      );
      let editedTable = this.getLocalModel().getProperty(
        Constants.property.EDIT_BINDING
      );
      let aEdit = [];
      originalTable.forEach((value, key) => {
        if (
          value[Constants.property.PARAM_VALUE_DESC_PROPERTY] !=
          editedTable[key][Constants.property.PARAM_VALUE_DESC_PROPERTY]
        ) {
          aEdit.push(editedTable[key]);
        }
      });
      return aEdit;
    }
  };
});
