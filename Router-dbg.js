sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"Coty/RawMaterial/util/Constants",
	"sap/ui/core/routing/History"
], function(Controller, Constants, History) {
	"use strict";
	
	return Controller.extend("Coty.RawMaterial.view.Router", {
		
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		navBack: function(bIsFirstView, iJumpsNumber = -1) {
			window.history.go(iJumpsNumber);
		}
	});
});
