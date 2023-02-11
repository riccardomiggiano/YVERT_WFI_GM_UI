/**
 * Include custom formatter for UI
 */
jQuery.sap.require("YVERT_WFI_GM_UI.util.Formatter");

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "YVERT_WFI_GM_UI/util/Formatter",
    "YVERT_WFI_GM_UI/lib/underscore-min",
    "sap/m/Token"
], function (Controller, History, Formatter, undescorejs, Token) {
	"use strict";
	
	return Controller.extend("YVERT_WFI_GM_UI.controller.BaseController", {
		
		__targetName: null,
		__storage: null,
		underscorejs: _,
		formatter: Formatter,
		
		onInit: function() {
			
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			
			if( this.__targetName !== undefined ) 
				oRouter.getRoute(this.__targetName).attachPatternMatched(this._onRouteMatched, this);

			// init LocalStorage
			jQuery.sap.require("jquery.sap.storage");
			this.__storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);

		},
		
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		
		_onRouteMatched: function(oEvent) {
			var args = oEvent.getParameters().arguments,
				argsValues = [oEvent];

			for ( var key in args) {
				if (args.hasOwnProperty(key)) {
					var obj = args[key];
					argsValues.push(obj);
				}
			}

			this.onRouteMatched.apply(this, argsValues);
		},
		
		onRouteMatched: function(oEvent) {
			//Do something here ;)
		},
		
		/**
		 * TEST METHOD
		 */
		onNavBack: function (oEvent){
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				this.getView().getModel("temp").setProperty("/canReload", true);
				this.getView().getModel("temp").setProperty("/IsDetail", false);
				this.getView().getModel("temp").setProperty("/IsSocietaSelected", false);
				this.getView().getModel("temp").setProperty("/IsSocietaASelected", false);
				this.getView().getModel("temp").setProperty("/IsDVSelected", false);
				this.getView().getModel("temp").setProperty("/isClicked/DatiGeneraliSet", false);
				this.getView().getModel("temp").setProperty("/isClicked/DatiVenditeSet", false);
				this.getView().getModel("temp").setProperty("/isClicked/DatiAcquistiSet", false);
				this.getView().getModel("temp").setProperty("/RifiutoFPF", false);
				this.getView().getModel("temp").setProperty("/SalesBlock", false);
				this.getView().getModel("temp").setProperty("/TotalBlock", false);
				this.getView().getModel("temp").setProperty("/BlockValue", "");
				this.getView().getModel("temp").setProperty("/IvaVendite/Changed", "");
				this.getView().getModel("temp").setProperty("/IvaVendite/CodiceIvaVendite", "");
				this.getView().getModel("temp").setProperty("/IvaVendite/CodiceIvaAcquisti", "");
				this.getView().getModel("temp").setProperty("/IvaVendite/ReverseCharge", "");
				this.getView().getModel("temp").setProperty("/IvaVendite/Detrazione", "");
				this.getView().getModel("temp").setProperty("/IvaVendite/DescrizioneMWST", "");
				this.getView().getModel("temp").setProperty("/IvaVendite/DescrizioneIvaAcquisti", "");
				history.go(-1);
			} else {
				this.getRouter().navTo("mainpage", {}, true);
			}
			
		},
		
		OnSelect: function (oEvent){
			oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
		},	
		
		
		
		read: function(filters){
			var oView = this.getView(),
			oModel = oView.getModel("HomePageSet"),
			oTable = this.byId("materialTable"),
			oDataModel = oView.getModel();
			oDataModel.read("/HomePageSet", {
				filters:filters,
				success: function(data, oResponse){
					oModel.setProperty("/", data.results);
					//oView.setModel(oModel);
					oTable.setModel(oModel);
					oTable.setVisible(true)
					oView.setBusy(false);
					
				},
				error: function(error){
					oView.setBusy(false);
				}
			});
			
		},
		
		_takeAuthorizations : function (oEvent) {
			var oView = this.getView(),
				oModel = oView.getModel("authorizations"),
				oDataModel = oView.getModel();
				oDataModel.read("/AutorizzazioniSet",{
					success: function(data){
						//var Societa = data.results[0].Societa === "*" ? "" : data.results[0].Societa;
						oModel.setProperty("/", data.results[0]);
						//oModel.setProperty("/Societa", Societa);
						oView.setBusy(false);
					},
					error: function(error){
						oView.setBusy(false);
					}
				});
		},
		
		
		
		////////////////////////////////////////////////////////////
		//	DIALOG
		////////////////////////////////////////////////////////////
		
		openDialog: function (dialogPath) {
			if (!this.__dialog) {
				this.__dialog = sap.ui.xmlfragment(dialogPath, this);
				this.getView().addDependent(this.__dialog);
			}
			return this.__dialog;
		},
		
		closeDialog: function() {
			if (this.__dialog) {
				if( this.__dialog.close ) {
					this.__dialog.close();
				}
				this.__dialog.destroy();
				this.__dialog = null;
			}
		},
		
		openExpandDialog: function (dialogPath) {
			if (!this.__dialog2) {
				this.__dialog2 = sap.ui.xmlfragment(dialogPath, this);
				this.getView().addDependent(this.__dialog2);
			}
			return this.__dialog2;
		},
		
		
		
		closeExpandDialog: function() {
			if (this.__dialog2) {
				if( this.__dialog2.close ) {
					this.__dialog2.close();
				}
				this.__dialog2.destroy();
				this.__dialog2 = null;
			}
		},
		
		openCIVAVNDDialog: function(dialogPath) {
			if (!this.__dialog3) {
				this.__dialog3 = sap.ui.xmlfragment(dialogPath, this);
				this.getView().addDependent(this.__dialog3);
			}
			return this.__dialog3;
		},
		
		closeCIVAVNDDialog: function() {
			if (this.__dialog3) {
				if( this.__dialog3.close ) {
					this.__dialog3.close();
				}
				this.__dialog3.destroy();
				this.__dialog3 = null;
			}
		},
		
		
		_handleValueHelpSearch: function(oEvent){
			var sValue = oEvent.getParameters().value,
			sName = oEvent.getSource().data("filterName"),
			sField= oEvent.getSource().data("filterField"),
			oField= oEvent.getSource().data("filterTableField"),
			filters = [],
			qFilters = [];
			
			if(sField !== "" && sValue.length>=2){

				filters.push(new sap.ui.model.Filter(sField,sap.ui.model.FilterOperator.Contains,sValue));
			}

			qFilters=filters;
			if(filters.length>1){
				qFilters = new sap.ui.model.Filter({filters:filters,and:false});
			}

			
			if(oField !== "MWST"){
				var oDialog = this.openDialog("YVERT_WFI_GM_UI.view.fragment.MultiInput.ValueHelp" + sName);
			}else{
				var oDialog = this.openCIVAVNDDialog("YVERT_WFI_GM_UI.view.fragment.MultiInput.ValueHelp" + sName);
			}
				oDialog.getBinding("items").filter(qFilters);
			
		},
		

		
		_handleValueHelpClose : function (evt) {
						
			var that = this,
			oSelectedItem = evt.getParameter("selectedItem"),
			sField = evt.getSource().data("filterTableField"),
			Input = this.getView().byId(sField),
			aSingleFilter;
			
			if (oSelectedItem) {			
				
				var sValue = oSelectedItem.data("key"),
				sValueTitle = oSelectedItem.getTitle();
				
				aSingleFilter = [{Path: sField, Operator: "EQ",Value1 : sValue , Value2:"",title : sValue}];
				
				this.FilterUtils.refreshInFilterModel(that, sField);
				this.FilterUtils.putInFilterModel(that, sField, aSingleFilter);	
				
				Input.setValue(sValueTitle);
				
			}
			
			this.closeDialog();
		},
		
		
		_handleValueHelpCloseListFP : function (evt) {
			
			var that = this,
			oView = that.getView(),
			Home = oView.getId().includes("homepage"),
			oList= evt.getSource().getId(),
			oSelectedItem = evt.getParameter("selectedItems"),
			sField = evt.getSource().data("InputField"),
			oMultiInput = Home ? sap.ui.getCore().byId("dialogSales9") : sap.ui.getCore().byId(sField),
			oArray = [];
			
			oMultiInput.setTokens([]);

			if (oSelectedItem && oSelectedItem.length > 0) {
				oSelectedItem.forEach(function (oItem) {
					oMultiInput.addToken(new Token({
						text: oItem.getTitle(),
						key: oItem.data("key")
					}));
					oArray.push(oItem.data("key"));
					
				});
				
				this.getView().getModel("temp").setProperty("/" + oList, oArray.join(';'));
				oMultiInput.setValueState(sap.ui.core.ValueState.None);
			}

			this.closeExpandDialog();
		},
		
		handleValueHelpCloseCIVAVND: function (oEvent) {
			var oModel = this.getView().getModel(),
				oTempModel= this.getView().getModel("temp"),
				oFields = oModel.getProperty("MatchCodesCIVAVND>/"),
				sID=oEvent.getSource().data("input"),
				oInput = sap.ui.getCore().byId(sID) === undefined ? this.getView().byId(sID) : sap.ui.getCore().byId(sID);

			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([]);

			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				var oSelected= aContexts.map(function (oContext) { 
					return oContext.getObject(); });
			//oInput.setValue(oSelected[0].Value);
			oInput.setValue(oSelected[0].Value2);
			oInput.data("key", oSelected[0].Name);
			
			// BEGIN MP - GESTIONE CAMPI PROVENIENTI DAL MATCHCODE IVA
			this.getView().getModel("temp").setProperty("/IvaVendite/Changed", "X");
			this.getView().getModel("temp").setProperty("/IvaVendite/CodiceIvaVendite", oSelected[0].Name2);
			this.getView().getModel("temp").setProperty("/IvaVendite/CodiceIvaAcquisti", oSelected[0].Name3);
			this.getView().getModel("temp").setProperty("/IvaVendite/ReverseCharge", oSelected[0].Name4);
			this.getView().getModel("temp").setProperty("/IvaVendite/Detrazione", oSelected[0].Name5);
			this.getView().getModel("temp").setProperty("/IvaVendite/DescrizioneMWST", oSelected[0].Value);
			this.getView().getModel("temp").setProperty("/IvaVendite/DescrizioneIvaAcquisti", oSelected[0].Value3);
			// END MP - GESTIONE CAMPI PROVENIENTI DAL MATCHCODE IVA
			}
			
			
			//this.closeCIVAVNDDialog();
		},
		
		
		
		_getEntries : function (section, action,source) {
			
			var oTempModel= this.getView().getModel("temp"),
			sCodiceMateriale = this.getView().getModel("DatiGeneraliSet") ? this.getView().getModel("DatiGeneraliSet").getData().CodiceMateriale : "",
			sDescrizioneMateriale = this.getView().getModel("DatiGeneraliSet") ? this.getView().getModel("DatiGeneraliSet").getData().DescrizioneMateriale : "",
			sTipoMateriale = this.getView().getModel("DatiGeneraliSet") ? this.getView().getModel("DatiGeneraliSet").getData().TipoMateriale : "",
			sSAM = this.getView().getModel("DatiGeneraliSet") ? this.getView().getModel("DatiGeneraliSet").getData().SAM : "";
			
			switch(section){
		
				case "DatiVenditeSet":
					
					var oEntry = {
					CodiceMateriale: action === 'C' ? '' : sCodiceMateriale,
					Societa: source.byId("dialogSales13").getSelectedKey(),
					SocietaVendite: source.byId("dialogSales1").getSelectedKey(),
					DescrizioneSocietaVendite: source.byId("dialogSales1")._getSelectedItemText() === "" ? source.byId("dialogSales1")._getSelectedItemText() : source.byId("dialogSales1").getSelectedItem().getBindingContext("SocietaSetDatiVenditeSet").getObject("Value"),
					DivisioneVendite: source.byId("dialogSales2").getSelectedKey(),
					DescrizioneDivisioneVendite: source.byId("dialogSales2").getValue() === "" ? source.byId("dialogSales2").getValue() : source.byId("dialogSales2").getSelectedItem().getBindingContext("MatchCodesVTWEG").getObject("Value"),
					DivisioneConsegna: source.byId("dialogSales3").getSelectedKey(),
					//GSM: source.byId("dialogSales4").getSelectedKey(),
					GdC: source.byId("dialogSales5").getSelectedKey(),
					DescrizioneGdC: source.byId("dialogSales5").getValue() === "" ? source.byId("dialogSales5").getValue() : source.byId("dialogSales5").getSelectedItem().getBindingContext("MatchCodesGCM").getObject("Value"),
					ContoCoGe: action === 'R' ? source.byId("dialogSales7") : source.byId("dialogSales7").getValue(),
					DescrizioneContoCoGe: action === 'R' ? source.byId("dialogSales8") : source.byId("dialogSales8").getValue(),
					// BEGIN MP - GESTIONE CAMPI PROVENIENTI DAL MATCHCODE IVA
					//MWST: source.byId("dialogSales6").data("key") !== null ? source.byId("dialogSales6").data("key") : "",
					//DescrizioneMWST: source.byId("dialogSales6").getValue(),
					MWST: source.byId("dialogSales6").data("key") !== null ? source.byId("dialogSales6").data("key") : "",
					CodiceIvaVendite: this.getView().getModel("temp").getProperty("/IvaVendite/CodiceIvaVendite"),
					CodiceIvaAcquisti: this.getView().getModel("temp").getProperty("/IvaVendite/CodiceIvaAcquisti"),
					ReverseCharge: this.getView().getModel("temp").getProperty("/IvaVendite/ReverseCharge") === "SI" ? "X" : "",
					Detrazione: this.getView().getModel("temp").getProperty("/IvaVendite/Detrazione") === "SI" ? "X" : "",
					DescrizioneMWST: this.getView().getModel("temp").getProperty("/IvaVendite/DescrizioneMWST"),
					DescrizioneIvaVendite: source.byId("dialogSales6").getValue(),
					DescrizioneIvaAcquisti: this.getView().getModel("temp").getProperty("/IvaVendite/DescrizioneIvaAcquisti"),
					// END MP - GESTIONE CAMPI PROVENIENTI DAL MATCHCODE IVA
					//DescrizioneMWST: source.byId("dialogSales6").getValue() === "" ? source.byId("dialogSales6").getValue() : source.byId("dialogSales6").getSelectedItem().getBindingContext("MatchCodesCIVAVND").getObject("Value"),
					BloccoMateriale: this.getView().getModel("temp").getProperty("/BlockValue"),
					FPAlList: this.getView().getModel("temp").getProperty("/FPAList").length !== 0 ? this.getView().getModel("temp").getProperty("/FPAList") : ""
					};
					
					return oEntry;
					
					break;
					
				case "DatiAcquistiSet":
					var oEntry = {
					CodiceMateriale: sCodiceMateriale,
					Societa: source.byId("dialogPurchase12").getSelectedKey(),
					DescrizioneSocieta: source.byId("dialogPurchase12").getValue() === "" ? source.byId("dialogPurchase12").getValue() : source.byId("dialogPurchase12").getSelectedItem().getBindingContext().getObject("Value"),
					DivisioneAcquisti: source.byId("dialogPurchase1").getSelectedKey(),
					ClasseVal: source.byId("dialogPurchase2").getSelectedKey(),
					DescrizioneClasseVal: source.byId("dialogPurchase2").getValue() === "" ? source.byId("dialogPurchase2").getValue() : source.byId("dialogPurchase2").getSelectedItem().getBindingContext("MatchCodesCL_VAL").getObject("Value"),
					ContoCoGe: action === 'R' ? source.byId("dialogPurchase5") : source.byId("dialogPurchase5").getValue(),
					DescrizioneContoCoGe: action === 'R' ? source.byId("dialogPurchase6") : source.byId("dialogPurchase6").getValue(),
					ContoInvestimento: source.byId("dialogPurchase11").getSelected() ? 'X' : '',
					ContoEsercizio: source.byId("dialogPurchase16").getSelected() ? 'X' : '',
					ClasseValInvestimento: source.byId("dialogPurchase13").getSelectedKey(),
					DescrizioneClasseValInvestimento:  action === 'R' ? source.byId("dialogPurchase13") : (source.byId("dialogPurchase13").getValue() === "" ? source.byId("dialogPurchase13").getValue() : 
						source.byId("dialogPurchase13").getSelectedItem().getBindingContext("MatchCodesCL_VAL_I").getObject("Value")),
					ContoCoGeInvestimento:  action === 'R' ? source.byId("dialogPurchase14") : source.byId("dialogPurchase14").getValue(),
					DescrizioneContoCoGeInvestimento:  action === 'R' ? source.byId("dialogPurchase15") : source.byId("dialogPurchase15").getValue()
					};
					
					return oEntry;
					
					break;
				
				case "AddDatiVenditeSet":
					
					var oEntry = {
					CodiceMateriale: sCodiceMateriale,
					Societa: source.byId("dialogAddSales13").getSelectedKey(),
					SocietaVendite: source.byId("dialogAddSales1").getSelectedKey(),
					DescrizioneSocietaVendite: source.byId("dialogAddSales1")._getSelectedItemText() === "" ? source.byId("dialogAddSales1")._getSelectedItemText() : source.byId("dialogAddSales1").getSelectedItem().getBindingContext("SocietaSetAddDatiVenditeSet").getObject("Value"),
					DivisioneVendite: source.byId("dialogAddSales2").getSelectedKey(),
					DescrizioneDivisioneVendite: source.byId("dialogAddSales2").getValue() === "" ? source.byId("dialogAddSales2").getValue() : source.byId("dialogAddSales2").getSelectedItem().getBindingContext("MatchCodesAddVTWEG").getObject("Value"),
					DivisioneConsegna: source.byId("dialogAddSales3").getSelectedKey(),
					//GSM: source.byId("dialogAddSales4").getSelectedKey(),
					//GdC: source.byId("dialogAddSales5").getSelectedKey(),
					GdC: source.byId("dialogAddSales5").data("key") !== null ? source.byId("dialogAddSales5").data("key") : "",
					//DescrizioneGdC: source.byId("dialogAddSales5").getValue() === "" ? source.byId("dialogAddSales5").getValue() : source.byId("dialogAddSales5").getSelectedItem().getBindingContext("MatchCodesAddGCM").getObject("Value"),
					DescrizioneGdC: source.byId("dialogAddSales5").data("description") !== null ? source.byId("dialogAddSales5").data("description") : "",
					ContoCoGe: action === 'R' ? source.byId("dialogAddSales7") : source.byId("dialogAddSales7").getValue(),
					DescrizioneContoCoGe: action === 'R' ? source.byId("dialogAddSales8") : source.byId("dialogAddSales8").getValue(),
					// BEGIN MP - GESTIONE CAMPI PROVENIENTI DAL MATCHCODE IVA
					//MWST: source.byId("dialogAddSales6").data("key") !== null ? source.byId("dialogAddSales6").data("key") : "",
					//DescrizioneMWST: source.byId("dialogAddSales6").getValue(),	
					MWST: source.byId("dialogAddSales6").data("key") !== null ? source.byId("dialogAddSales6").data("key") : "",
					CodiceIvaVendite: this.getView().getModel("DatiVenditeSet").getData()[0].CodiceIvaVendite,
					CodiceIvaAcquisti: this.getView().getModel("DatiVenditeSet").getData()[0].CodiceIvaAcquisti,
					ReverseCharge: this.getView().getModel("DatiVenditeSet").getData()[0].ReverseCharge,
					Detrazione: this.getView().getModel("DatiVenditeSet").getData()[0].Detrazione,
					DescrizioneMWST: this.getView().getModel("DatiVenditeSet").getData()[0].DescrizioneMWST,
					DescrizioneIvaVendite: source.byId("dialogAddSales6").getValue(),
					DescrizioneIvaAcquisti: this.getView().getModel("DatiVenditeSet").getData()[0].DescrizioneIvaAcquisti,
					// END MP - GESTIONE CAMPI PROVENIENTI DAL MATCHCODE IVA
					//MWST: source.byId("dialogAddSales6").getSelectedKey(),
					//DescrizioneMWST: source.byId("dialogAddSales6").getValue() === "" ? source.byId("dialogAddSales6").getValue() : source.byId("dialogAddSales6").getSelectedItem().getBindingContext("MatchCodesAddCIVAVND").getObject("Value"),
					BloccoMateriale: this.getView().getModel("temp").getProperty("/BlockValue"),
					FPAlList: this.getView().getModel("temp").getProperty("/FPAList").length !== 0 ? this.getView().getModel("temp").getProperty("/FPAList") : ""
					};
					
					return oEntry;
					
					break;
					
				case "AddDatiAcquistiSet":
					var oEntry = {
					CodiceMateriale: sCodiceMateriale,
					Societa: source.byId("dialogAddPurchase12").getSelectedKey(),
					DescrizioneSocieta: source.byId("dialogAddPurchase12").getValue() === "" ? source.byId("dialogAddPurchase12").getValue() : source.byId("dialogAddPurchase12").getSelectedItem().getBindingContext().getObject("Value"),
					DivisioneAcquisti: source.byId("dialogAddPurchase1").getSelectedKey(),
					//ClasseVal: source.byId("dialogAddPurchase2").getSelectedKey(),
					ClasseVal: source.byId("dialogAddPurchase2").getSelectedKey() === "" ? source.byId("dialogAddPurchase2_bis").data("key") : source.byId("dialogAddPurchase2").getSelectedKey(),
					DescrizioneClasseVal: source.byId("dialogAddPurchase2").getValue() === "" ? source.byId("dialogAddPurchase2_bis").getValue() : 
						source.byId("dialogAddPurchase2").getSelectedItem().getBindingContext("MatchCodesAddCL_VAL").getObject("Value"),
					ContoCoGe: action === 'R' ? source.byId("dialogAddPurchase5") : source.byId("dialogAddPurchase5").getValue(),
					DescrizioneContoCoGe: action === 'R' ? source.byId("dialogAddPurchase6") : source.byId("dialogAddPurchase6").getValue(),
					ContoInvestimento: source.byId("dialogAddPurchase11").getSelected() ? 'X' : '',
					ContoEsercizio: source.byId("dialogAddPurchase16").getSelected() ? 'X' : '',
					ClasseValInvestimento: source.byId("dialogAddPurchase13").getSelectedKey() === "" ? source.byId("dialogAddPurchase13_bis").data("key") : source.byId("dialogAddPurchase13").getSelectedKey(),
					DescrizioneClasseValInvestimento:  action === 'R' ? source.byId("dialogAddPurchase13") : (source.byId("dialogAddPurchase13").getValue() === "" ? source.byId("dialogAddPurchase13_bis").getValue() : 
						source.byId("dialogAddPurchase13").getSelectedItem().getBindingContext("MatchCodesAddCL_VAL_I").getObject("Value")),
					ContoCoGeInvestimento:  action === 'R' ? source.byId("dialogAddPurchase14") : source.byId("dialogAddPurchase14").getValue(),
					DescrizioneContoCoGeInvestimento:  action === 'R' ? source.byId("dialogAddPurchase15") : source.byId("dialogAddPurchase15").getValue(),
					FPVlList: this.getView().getModel("temp").getProperty("/FPVList").length !== 0 ? this.getView().getModel("temp").getProperty("/FPVList") : ""
				};
					
					return oEntry;
					
					break;
					
				default:
					var oEntry = {
						CodiceMateriale: action === 'C' ? '' : sCodiceMateriale,
						DescrizioneMateriale: action === 'C' ? source.byId("dialogGeneral1").getValue() : sDescrizioneMateriale,
						TipoMateriale: action === 'C' ? source.byId("dialogGeneral2").getSelectedKey() : sTipoMateriale,
						BloccoMateriale: this.getView().getModel("temp").getProperty("/BlockValue"),
						//SettoreMerceologico: source.byId("dialogGeneral3").getSelectedKey(),
						SAM: action === 'C' ? "" : sSAM

						};
				
					return oEntry;
					
					break;
			}
				
			

		},
		
		
	/*  READ COMPANY */
		
		readConditionSelect: function(filters, section,SocV){		
			var oView = this.getView(),
				self = this,
				oDataModel = oView.getModel(),
				oAddDialog= section.includes("Add"),
				sSocVen = oAddDialog ? sap.ui.getCore().byId("dialogAddSales1") : sap.ui.getCore().byId("dialogSales1"),
				oTempModel= this.getView().getModel("temp"),

				oPath = section.includes("DatiAcquistiSet") ? "/MatchCodesSet" : "/MatchCodesRFCSet";
			
				oDataModel.read(oPath, {
					filters: filters,
					success: function(data, oResponse){
						if(data.results.length > 0){
							var oModelJson = new sap.ui.model.json.JSONModel();
							oModelJson.setData(data.results);
							oView.setModel(oModelJson,"SocietaSet" + section);
							oTempModel.setProperty("/IsSocietaSelected", true);
							//sSocVen.setValueState(sap.ui.core.ValueState.None);
							
							
							
							if(section === "DatiVenditeSet" || section === "AddDatiVenditeSet"){
								//self.readField(section,"VTWEG","A", data.results[0].Societa,data.results[0].Name);
								self.readField(section,"VTWEG","A", data.results[0].Societa,SocV);
								self.readField(section,"GCM","A", data.results[0].Societa);
								self.readField(section,"CIVAVND","A", data.results[0].Societa);
								self.readFPList(section, data.results[0].Societa, "FPAListSet");
							}else{
								self.readField(section,"CL_VAL","P", filters[0].oValue1);
								self.readField(section,"CL_VAL_I","P", filters[0].oValue1);
								self.readFPList(section, filters[0].oValue1, "FPVListSet");
								oTempModel.setProperty("/IsSocietaASelected", true);
							}
						}else{
							self.oResetTempModel(section);
						}
							
							
							
							oView.setBusy(false);
					},
					error: function(error){
						oView.setBusy(false);
					}
				});
		},
		
		readDivConv: function(filters, section){		
			var oView = this.getView(),
				oDataModel = oView.getModel(),
				oAddDialog= section.includes("Add"),
				oTempModel= this.getView().getModel("temp");
				oDataModel.read("/MatchCodesSet", {
					filters: filters,
					success: function(data, oResponse){

							var oModelJson = new sap.ui.model.json.JSONModel();
							
							oModelJson.setData(data.results);
							oAddDialog ? oView.setModel(oModelJson,"AddDivisioneConvSet") : oView.setModel(oModelJson,"DivisioneConvSet");
							oTempModel.setProperty("/IsSocietaSelected", true);
							

							oView.setBusy(false);
						
						
					},
					error: function(error){
						oView.setBusy(false);
					}
				});
		},
		
		readFPList: function(section,societa,path){		
			var oView = this.getView(),
			oAddDialog= section.includes("Add"),
			oDataModel = oView.getModel(),
			aFilters=[];
			
			aFilters.push( new sap.ui.model.Filter({path:"Societa", operator: sap.ui.model.FilterOperator.EQ ,value1:societa}));

			
			oDataModel.read("/" + path, {
				filters: aFilters,
				success: function(data, oResponse){

						var oModelJson = new sap.ui.model.json.JSONModel();
						oModelJson.setData(data.results);
						oView.setModel(oModelJson,path);
						oView.setBusy(false);	
				},
				error: function(error){
					oView.setBusy(false);
				}
			});
		},
		
		readField: function(section,domain,type,sSocieta,sSocietaV,sDivV){		
			var oView = this.getView(),
				oAddDialog= section.includes("Add"),
				oDataModel = oView.getModel(),
				aFilters=[];
				//oDataModel.setSizeLimit(300);
				aFilters.push( new sap.ui.model.Filter({path:"Societa", operator: sap.ui.model.FilterOperator.EQ ,value1:sSocieta}));
				aFilters.push( new sap.ui.model.Filter({path:"Domain", operator: sap.ui.model.FilterOperator.EQ ,value1:domain}));
				aFilters.push( new sap.ui.model.Filter({path:"Tipo", operator: sap.ui.model.FilterOperator.EQ ,value1:type}));
				if(domain === "VTWEG"){
					aFilters.push( new sap.ui.model.Filter({path:"Name", operator: sap.ui.model.FilterOperator.EQ ,value1:sSocietaV}));
				}
				if(domain === "SETTMRC"){
					aFilters.push( new sap.ui.model.Filter({path:"Name", operator: sap.ui.model.FilterOperator.EQ ,value1:sSocietaV}));
					aFilters.push( new sap.ui.model.Filter({path:"Value", operator: sap.ui.model.FilterOperator.EQ ,value1:sDivV}));
				}
				
				
				
				oDataModel.read("/MatchCodesRFCSet", {
					filters: aFilters,
					success: function(data, oResponse){

							var oModelJson = new sap.ui.model.json.JSONModel();
							oModelJson.setSizeLimit(999);
							oModelJson.setData(data.results);
							oAddDialog ? oView.setModel(oModelJson,"MatchCodesAdd" + domain) : oView.setModel(oModelJson,"MatchCodes" + domain);
							oView.setBusy(false);	
					},
					error: function(error){
						oView.setBusy(false);
					}
				});
		},
		
		_getRequiredFields: function (section, source) {
			
			switch(section){
			
			case "DatiGeneraliSet":
				
				var oFields = {
					DescrizioneMateriale: sap.ui.getCore().byId("dialogGeneral1"),
					TipoMateriale: sap.ui.getCore().byId("dialogGeneral2")
				};
				
				return oFields;
				
				break;
			
			case "DatiVenditeSet":
				
				var oFields = {
					Societa: source.byId("dialogSales13"),
					SocietaVendite: source.byId("dialogSales1"),
					DivisioneVendite: source.byId("dialogSales2"),
					FPAlList: source.byId("dialogSales9")
				};
				
				return oFields;
				
				break;
				
			case "DatiAcquistiSet":
				var oFields = {
					Societa: source.byId("dialogPurchase12"),
					DivisioneAcquisti: source.byId("dialogPurchase1"),
				};
				
				return oFields;
				
				break;
			case "AddDatiVenditeSet":
				var oFields = {
					Societa: source.byId("dialogAddSales13"),
					SocietaVendite: source.byId("dialogAddSales1"),
					DivisioneVendite: source.byId("dialogAddSales2"),
				};
				
				return oFields;
				
				break;
			case "AddDatiAcquistiSet":
				var oFields = {
					Societa: source.byId("dialogAddPurchase12"),
					DivisioneAcquisti: source.byId("dialogAddPurchase1"),
				};
				
				return oFields;
				
				break;
				
			default:
				var oFields = {
					DescrizioneMateriale: sap.ui.getCore().byId("dialogGeneral1"),
					TipoMateriale: sap.ui.getCore().byId("dialogGeneral2"),
					SocietaVendite: sap.ui.getCore().byId("dialogSales1"),
					DivisioneVendite: sap.ui.getCore().byId("dialogSales2")

					};
			
				return oFields;
				
				break;
			}
			
		},
		
		checkDialogFields: function () {
			var self = this,
				check = true,
				oRequiredField = 
				sDescrizioneMateriale = sap.ui.getCore().byId("dialogGeneral1"),
				sTipoMateriale = sap.ui.getCore().byId("dialogGeneral2"),
				sSettoreIndustriale = sap.ui.getCore().byId("dialogGeneral5"),
				sSocietaVendite = sap.ui.getCore().byId("dialogSales1"),
				sDivisioneVendite= sap.ui.getCore().byId("dialogSales2");
				
				var checkMat = sDescrizioneMateriale.getValue() !== "" ? true : false;
				var checkTipoMat = sTipoMateriale.getSelectedItem() !== null ? true : false;
				var checkIndu = sSettoreIndustriale.getSelectedItem() !== null ? true : false;
				var checkSV = sSocietaVendite.getSelectedItem() !== null ? true : false;
				var checkDV = sDivisioneVendite.getSelectedItem() !== null ? true : false;

				if (!checkMat) {
					sDescrizioneMateriale.setValueState(sap.ui.core.ValueState.Error);
					check = false;
				} else
					sDescrizioneMateriale.setValueState(sap.ui.core.ValueState.None);

				if (!checkTipoMat) {
					sTipoMateriale.setValueState(sap.ui.core.ValueState.Error);
					check = false;
				} else
					sTipoMateriale.setValueState(sap.ui.core.ValueState.None);
				
				if (!checkIndu) {
					sSettoreIndustriale.setValueState(sap.ui.core.ValueState.Error);
					check = false;
				} else
					sSettoreIndustriale.setValueState(sap.ui.core.ValueState.None);
				
				if (!checkSV) {
					sSocietaVendite.setValueState(sap.ui.core.ValueState.Error);
					check = false;
				} else
					sSocietaVendite.setValueState(sap.ui.core.ValueState.None);
				
				if (!checkDV) {
					sDivisioneVendite.setValueState(sap.ui.core.ValueState.Error);
					check = false;
				} else
					sDivisioneVendite.setValueState(sap.ui.core.ValueState.None);
			

			return check;
		},
		

		
		onCloseAddDialog: function (evt) {
			
			var oSection = evt.getSource().data("section");
			/*oTempModel = this.getView().getModel("temp");
			oSection === "DatiAcquistiSet" ? oTempModel.setProperty("/IsSocietaASelected", false) : oTempModel.setProperty("/IsSocietaSelected", false);*/
			
			this.oResetTempModel(oSection);
			this.closeDialog();
		},
		
		oResetTempModel: function (oSection) {
			var oTempModel = this.getView().getModel("temp");
			oSection === "DatiAcquistiSet" ? oTempModel.setProperty("/IsSocietaASelected", false) : oTempModel.setProperty("/IsSocietaSelected", false);
			oTempModel.setProperty("/IsDVSelected", false);
			
			var oAdd= oSection.includes("Add") ? "Add" :"";
			
			if(this.getView().getModel("MatchCodesSETTMRC") !== undefined){
				this.getView().getModel("MatchCodesSETTMRC").setProperty("/", []);
			}
			
			if(this.getView().getModel("SocietaSet" + oSection) !== undefined){
				this.getView().getModel("SocietaSet" + oSection).setProperty("/", []);
			}
			if(this.getView().getModel("MatchCodes" + oAdd + "VTWEG") !== undefined){
				this.getView().getModel("MatchCodes" + oAdd + "VTWEG").setProperty("/", []);
			}
			
			if(this.getView().getModel("MatchCodes" + oAdd + "GCM") !== undefined){
				this.getView().getModel("MatchCodes" + oAdd + "GCM").setProperty("/", []);
			}
			if(this.getView().getModel("MatchCodes" + oAdd + "CIVAVND") !== undefined){
				this.getView().getModel("MatchCodes" + oAdd + "CIVAVND").setProperty("/", []);
			}
			
			//var CF = oAdd === "Add" ? sap.ui.getCore().byId("dialogAddSales6") : sap.ui.getCore().byId("dialogSales6");
			var CF = sap.ui.getCore().byId("dialogSales6");
			if(CF !== undefined){
				CF.setValue("");
			}
			
			
			if(this.getView().getModel("MatchCodes" + oAdd + "CL_VAL") !== undefined){
				this.getView().getModel("MatchCodes" + oAdd + "CL_VAL").setProperty("/", []);
			}
			
			if(this.getView().getModel(oAdd + "DivisioneVenditeSet") !== undefined){
				this.getView().getModel(oAdd + "DivisioneVenditeSet").setProperty("/", []);
			}
			if(this.getView().getModel(oAdd + "DivisioneConvSet") !== undefined){
				this.getView().getModel(oAdd + "DivisioneConvSet").setProperty("/", []);
			}
			
			
			this.getView().getModel("temp").setProperty("/FPAList", []);
			if(sap.ui.getCore().byId("dialogSales9") !== undefined){
				 sap.ui.getCore().byId("dialogSales9").setTokens([]);
			}
			

		},
		
		_OnFirstCreate: function (Path1, Path2, oModel, oEntry1, oEntry2, oController, MessageBox) {

			var oResourceBundle = oController.getOwnerComponent().getModel("i18n").getResourceBundle();

			oController.getView().setBusy(true);

			oModel.create(Path1, oEntry1, {
				success: function (dataSuccess,response) {
					var res = JSON.parse(response.headers["sap-message"]);				
					if(res.severity === "error"){
						
						MessageBox.error(res.message, {
							icon: ""
							});
						
						oController.getView().setBusy(false);
						oController.closeDialog();
						
					}else{
						oEntry2.CodiceMateriale = dataSuccess.CodiceMateriale;
						oController._OnSecondCreate(Path2, oModel, oEntry2, oController, MessageBox);
					}

				},
				error: function (dataError) {
					var message = "Errore nella creazione";
					MessageBox.error(message, {
						icon: ""
						});
					
					oController.getView().setBusy(false);
					oController.closeDialog();
				}
			});
	
		},
		
		_OnSecondCreate: function (Path, oModel, oEntry, oController, MessageBox) {

			var oResourceBundle = oController.getOwnerComponent().getModel("i18n").getResourceBundle();

		
			oModel.create(Path, oEntry, {
				success: function (dataSuccess, response) {
					var res = JSON.parse(response.headers["sap-message"]);
					if(res.severity === "error"){
						
						MessageBox.error(res.message, {
							icon: ""
							});
						
						oController._deleteMaterial(oModel, oEntry, oController, MessageBox);
						
					}else{
						oController.onRefresh();
						oController.closeDialog();
						oController.oResetTempModel("DatiVenditeSet");
						
						MessageBox.success(res.message, {
							icon: ""
						});
					}
					
				},
				error: function (dataError) {
					
					oController._deleteMaterial(oModel, oEntry, oController, MessageBox);
					
				}
			});
	
		},
		
		_deleteMaterial: function(oModel,oEntry,oController,MessageBox){
					
					var oResourceBundle = oController.getOwnerComponent().getModel("i18n").getResourceBundle();
					
					oController.getView().setBusy(true);
		
					oModel.remove("/DatiGeneraliSet(CodiceMateriale='" + oEntry.CodiceMateriale + "',Societa='" + oEntry.Societa + "')",  {
						success: function (dataSuccess, response) {
							var res = JSON.parse(response.headers["sap-message"]);
							MessageBox.error(res.message, {
								icon: ""
								});
							oController.closeDialog();
							oController.getView().setBusy(false);

						},
		
						error: function (dataError) {
							oController.getView().setBusy(false);
							oController.closeDialog();
						}
					});
				},
				
				_onSectionEditPress: function(Path, oModel, oEntry, oSection, oController, MessageBox){
					
					oController.getView().setBusy(true);
						
					oModel.update(Path,oEntry, {
						method:"PUT",
						success: function (dataSuccess, response) {
							var res = JSON.parse(response.headers["sap-message"]);
							if(res.severity === "error"){
								
								MessageBox.error(res.message, {
									icon: ""
									});
								
								oController.getView().setBusy(false);					
								oController.closeDialog();

							}else{
								
								oController.closeDialog();
								MessageBox.success(res.message, {
									icon: ""
								});
								oController.onEditSuccess(oSection);
							}
							
							
						},
						error: function (dataError) {
							var message = "Errore nella creazione";

							MessageBox.error(dataError.message, {
							icon: ""
							});

						oController.getView().setBusy(false);					
						oController.closeDialog();
						}
					});
				},
				
				_onApproveRejectPress: function (Path, oModel, oEntry, oController, MessageBox) {

					var oResourceBundle = oController.getOwnerComponent().getModel("i18n").getResourceBundle();
					

					oController.getView().setBusy(true);
					
					oModel.update(Path,  oEntry, {
						method:"PUT",
						success: function (dataSuccess, response) {
							var res = JSON.parse(response.headers["sap-message"]);						
							if(res.severity === "error"){
								
								MessageBox.error(res.message, {
									icon: ""
									});
								
								oController.getView().setBusy(false);					
								oController.closeDialog();

							}else{
								oController.closeDialog();
								
								MessageBox.success(res.message, {
									icon: ""
								});

								oController.onSuccess();
								oController.getView().setBusy(false);
							}
							
						},
						error: function (dataError) {

							MessageBox.error(dataError.message, {
								icon: ""
								});

							oController.getView().setBusy(false);					
							oController.closeDialog();
						}
					});
				
				},
				
				_OnCreate: function (Path, oModel, oEntry, oController, MessageBox) {

					var oResourceBundle = oController.getOwnerComponent().getModel("i18n").getResourceBundle();

					oModel.create(Path, oEntry, {
						success: function (dataSuccess, response) {
							var res = JSON.parse(response.headers["sap-message"]);
							if(res.severity === "error"){
								
								MessageBox.error(res.message, {
									icon: ""
									});
								
								oController.getView().setBusy(false);					
								oController.closeDialog();

							}else{
								
								oController.closeDialog();
								MessageBox.success(res.message, {
									icon: ""
								});							
								oController.onSuccess(Path);
							}
							
							
							
							

						},
						error: function (dataError) {
							
							var message = "Errore nella creazione";

							MessageBox.error(oController.parseError(dataError), {
							icon: ""
							});

						oController.getView().setBusy(false);					
						oController.closeDialog();
							
						}
					});
			
				},
				parseError: function (e) {
					let errorMessage;
					try {
						errorMessage = JSON.parse(e.responseText).error.message.value;
					} catch (error) {
						errorMessage = e.message;
					}
					return errorMessage;
				},
				
				_generateDetailFilters: function(oController){
					var oModel= oController.getView().getModel("DatiGeneraliSet"),
					sCodiceMateriale = oModel.getData().CodiceMateriale,
					filters = [];

					filters.push( new sap.ui.model.Filter({path:"CodiceMateriale", operator: sap.ui.model.FilterOperator.EQ ,value1:sCodiceMateriale}));

					return filters;


			},
			
			



				
			onButtonDetailActionPress: function(oEvent){
				
				var section= oEvent.getSource().data("section"),
				oBindingContext = oEvent.getSource().getParent().getBindingContext(section),
				oTempModel= this.getView().getModel("temp"),
				Societa = section === 'DatiVenditeSet' ? this.getView().byId("dialogSales13") : this.getView().byId("dialogPurchase12"),
				obj = oBindingContext.getObject(),
				filters=[];
				oTempModel.setProperty("/Enabled/" + section, false);
				oTempModel.setProperty("/isClicked/" + section, false);
				obj.ContoEsercizio !== '' ? oTempModel.setProperty("/FlagEsercizio", "X") : oTempModel.setProperty("/FlagEsercizio", "");
				obj.ContoInvestimento === "X" ? oTempModel.setProperty("/FlagInvestimento", "X") : oTempModel.setProperty("/FlagInvestimento", "");
				//BEGIN MP - GESTIONE BLOCCO VENDITE
				obj.BloccoMateriale === "" ? oTempModel.setProperty("/SalesBlock", false) : oTempModel.setProperty("/SalesBlock", true);
				//END MP - GESTIONE BLOCCO VENDITE
				var oModelDetailList = new sap.ui.model.json.JSONModel();
				oModelDetailList.setData(obj);
				this.getView().setModel(oModelDetailList,section + "Detail");
				
				if(section === 'DatiVenditeSet'){
					
					filters.push( new sap.ui.model.Filter({path:"Societa", operator: sap.ui.model.FilterOperator.EQ ,value1:obj.Societa}));
					filters.push( new sap.ui.model.Filter({path:"Tipo", operator: sap.ui.model.FilterOperator.EQ ,value1:"A"}));
					filters.push( new sap.ui.model.Filter({path:"Domain", operator: sap.ui.model.FilterOperator.EQ ,value1:"VKORG"}));
					//filters.push( new sap.ui.model.Filter({path:"SocietaVendite", operator: sap.ui.model.FilterOperator.EQ ,value1:obj.SocietaVendite}));

					this.getView().setBusy(true);
					this.readConditionSelect(filters,section,obj.SocietaVendite);
					
					var ofilters= [];
					ofilters.push( new sap.ui.model.Filter({path:"Domain", operator: sap.ui.model.FilterOperator.EQ ,value1:"DWERK"}));
					ofilters.push( new sap.ui.model.Filter({path:"Value", operator: sap.ui.model.FilterOperator.EQ ,value1:obj.Societa}));
					this.readDivConv(ofilters, section);

				}else if(section === 'DatiAcquistiSet') {
					filters.push( new sap.ui.model.Filter({path:"Value", operator: sap.ui.model.FilterOperator.EQ ,value1:obj.Societa}));
					filters.push( new sap.ui.model.Filter({path:"Domain", operator: sap.ui.model.FilterOperator.EQ ,value1:"WERKS"}));
					this.getView().setBusy(true);
					this.readConditionSelect(filters,section);
				}
				
				
				oTempModel.setProperty("/IsVisibleDetail" + section, true);

			}
				

		
	
		
	});
});