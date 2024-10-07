sap.ui.define([
	"Coty/RawMaterial/util/Constants",
	"Coty/RawMaterial/util/Commons"
], function(Constants, Commons) {
	"use strict";
	return {
		
		getSaveRestoreData: function(oData, sView) {
			return {
				Filters: oData.Filters,
				RawNumber: oData.MaterialSelected.RAWMATERIAL_NUMBER,
				RawVersion: oData.MaterialSelected.VERSION,
				RowSearched: oData.RowsSearched,
				selectedCompositionVendor: oData.selectedCompositionVendor,
				View: sView
			};
		},
		
		setComponentName: function(aComposition) {
			aComposition.map(oComposition => {
				oComposition.COMPONENT_NAME = oComposition.AINCINAME ? oComposition.AINCINAME : 
					(oComposition.APREFERREDNAME ? oComposition.APREFERREDNAME : 
                    (oComposition.AINCINAME_RAW ? oComposition.AINCINAME_RAW : oComposition.APREFERREDNAME_RAW)); 
				return oComposition;
			})
			
			return aComposition;
		}
	};
});
