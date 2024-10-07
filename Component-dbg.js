sap.ui.define([
	"sap/ui/core/UIComponent"
], function (UIComponent) {
	"use strict";

	return UIComponent.extend("Coty.RawMaterial.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

			let oComponentData = {
				Raw: new window.URL(location.href).searchParams.get("Raw"),
				Version: new window.URL(location.href).searchParams.get("Version"),
				TargetView: new window.URL(location.href).searchParams.get("TargetView"),
				App: new window.URL(location.href).searchParams.get("App")
			};

			if (!oComponentData.Raw) {
				sap.ui.getCore().getEventBus().publish("appRawMaterial", "init", {App: oComponentData.App});
				return;
			}

			sap.ui.getCore().getEventBus().publish("appRawMaterial", "init", {sRaw: oComponentData.Raw, sVersion: oComponentData.Version, sView: oComponentData.TargetView, App: oComponentData.App});
		}
	});
});
