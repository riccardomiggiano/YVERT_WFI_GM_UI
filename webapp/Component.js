sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"./model/models",
	"./MyRouter"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("YVERT_WFI_GM_UI.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

            var sRootPath = jQuery.sap.getModulePath("YVERT_WFI_GM_UI");
            
            
            /**
			 * IMPORT CUSTOM LIBS
			 */
			jQuery.getScript(sRootPath + "/lib/underscore-min.js");

            // set i18n model
			this.setModel(models.createResourceModel(sRootPath + "/i18n/i18n.properties"), "i18n");

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			// set the temp model
			this.setModel(models.createTempModel(),"temp");
			
			// set the authorizations model
			this.setModel(models.createAuthModel(), "authorizations");
			
			// set the report xls model
			this.setModel(models.createReportXlsModel(), "report");
			
			this.setModel(models.createHomeModel(), "HomePageSet");
			
			// set the filter model
			this.setModel(models.createFilterModel(),"oFieldFilterModel");
			
			// set the report model
			this.setModel(models.createReportModel(),"oFieldReportModel");
			
			
			// initi router
			this.getRouter().initialize();
			
			const oComponentData = this.getComponentData();
			if (oComponentData && oComponentData.startupParameters && oComponentData.startupParameters.level && oComponentData.startupParameters.level.length > 0){
				sap.ui.getCore().sCurrentLevel = oComponentData.startupParameters.level[0];
			}
			if (oComponentData && oComponentData.startupParameters && oComponentData.startupParameters.CodiceMateriale && oComponentData.startupParameters.CodiceMateriale.length > 0){
				sap.ui.getCore().CodiceMateriale = oComponentData.startupParameters.CodiceMateriale[0];
			}
			
		}
	});
});