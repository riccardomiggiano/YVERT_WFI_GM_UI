sap.ui.define([
	"YVERT_WFI_GM_UI/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"YVERT_WFI_GM_UI/util/Formatter",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"YVERT_WFI_GM_UI/util/Filter",
	"sap/ui/Device",
	"sap/m/Token"
	
], function(Controller, JSONModel,Formatter,MessageBox,MessageToast,Filter,FilterOperator,FilterUtils,Device, Token) {
	"use strict";

	return Controller.extend("YVERT_WFI_GM_UI.controller.Detail", {

		__targetName: "detail",
		formatter: Formatter,
		FilterUtils: FilterUtils,
		
		
		
		onRouteMatched: function(oEvent){
			var self = this,
			sCodiceMateriale =  oEvent.getParameters().arguments.codicemateriale,
			IconTabBar= this.getView().byId("IconTabBar");
			self.getView().setBusy(true);
			var oDataModel = this.getOwnerComponent().getModel();
			var oTempModel = this.getOwnerComponent().getModel("temp");
			oTempModel.setProperty("/Enabled/DatiGeneraliSet", false);
			oTempModel.setProperty("/Enabled/DatiVenditeSet", false);
			oTempModel.setProperty("/Enabled/DatiAcquistiSet", false);
			oTempModel.setProperty("/IsDetail", true);
			
			this._takeAuthorizations();
			
			 var sObjectPath = oDataModel.createKey("/DatiGeneraliSet", {
				 CodiceMateriale: sCodiceMateriale
                 });
			
			oDataModel.read(sObjectPath, {
				success: function(data, oResponse){
					var oModelJson = new sap.ui.model.json.JSONModel();
					oModelJson.setData(data);
					self.getView().setModel(oModelJson,"DatiGeneraliSet");
						self.HandleTabSelect("DatiVenditeSet");
					IconTabBar.setSelectedKey("DatiVenditeSet");
					self.getView().setBusy(false);
				},
				error: function(error){
					self.getView().setBusy(false);
				}
			});
			
			
		},
		
		onTabSelect: function(oEvent){
			var section = oEvent.getSource().getSelectedKey();
			this.HandleTabSelect(section);
		},
		
		HandleTabSelect: function(section){
			//var section = oEvent.getSource().getSelectedKey(),
			var	oSAM= this.getView().getModel("DatiGeneraliSet").getData().SAM,
				oTempModel = this.getView().getModel("temp"),
				PurCreated= oTempModel.getProperty("/isClicked/DatiAcquistiSet");
			

			if(section === "DatiVenditeSet" || section === "HistorySet"){ 
				this._bindSection(section); 
				}
			if(section === "DatiAcquistiSet"){
				oTempModel.setProperty("/IsSocietaASelected", false);
				if(oSAM === 'A1' || oSAM === 'R1'){
					oTempModel.setProperty("IsSocietaASelected", false);
					this.getView().byId("dialogPurchase12").setSelectedKey(null);
					this.getView().byId("dialogPurchase2").setSelectedKey(null);
					this.getView().byId("dialogPurchase5").setValue(null);
					this.getView().byId("dialogPurchase6").setValue(null);
					this.getView().byId("dialogPurchase11").setSelected(null);
					this.getView().byId("dialogPurchase16").setSelected(false);
					oTempModel.setProperty("/FlagInvestimento", "");
					oTempModel.setProperty("/FlagEsercizio", "");
					
					
					if(this.getView().getModel("SocietaSetDatiAcquistiSet") !== undefined){
						this.getView().getModel("SocietaSetDatiAcquistiSet").setProperty("/",[]);
					}
					if(this.getView().getModel("MatchCodesCL_VAL") !== undefined){
						this.getView().getModel("MatchCodesCL_VAL").setProperty("/",[]);
					}
					if(this.getView().getModel("MatchCodesCL_VAL_I") !== undefined){
						this.getView().getModel("MatchCodesCL_VAL_I").setProperty("/",[]);
					}
					this.getView().byId("dialogPurchase14").setValue(null);
					this.getView().byId("dialogPurchase15").setValue(null);
					
					
				}else{
					this._bindSection(section);
				}
					
			}


		},
		
		handleValueHelpCIVAVND: function(oEvent){
			
			var oSource = oEvent.getSource(),
				oValue= oSource.getValue(),
				section= oEvent.getSource().data("section"),
				sField = oEvent.getSource().data("filterTableField"),
				sName = oSource.data("fieldName");

				var oDialog = this.openCIVAVNDDialog("YVERT_WFI_GM_UI.view.fragment.MultiInput.ValueHelp" + sName);

		
				oDialog.open();
			
		},
		

		
		
		_bindSection: function(Path){
			var self = this,
			oDataModel = self.getView().getModel(),
			filters = self._generateDetailFilters(this),
			oTempModel= self.getView().getModel("temp"),
			IconTabBar= this.getView().byId("IconTabBar"),
			oTab = IconTabBar.getSelectedKey();
			
			oTempModel.setProperty("/IsVisibleDetailDatiVenditeSet", false);
			oTempModel.setProperty("/IsVisibleDetailDatiAcquistiSet", false);
			
			if(this.getView().getModel(Path) !== undefined){
				this.getView().getModel(Path).setProperty("/", []);
			}
			self.getView().setBusy(true);
			
				oDataModel.read("/" + Path, {
					filters: filters,
					success: function(data, oResponse){
							var oModelSection = new sap.ui.model.json.JSONModel();
							Path === "DatiGeneraliSet" ? oModelSection.setData(data.results[0]) : oModelSection.setData(data.results);
							self.getView().setModel(oModelSection,Path);
							if(Path === "DatiGeneraliSet"){
								self.HandleTabSelect(oTab);
							}
						
						self.getView().setBusy(false);
								
							
					},
					
					error: function(error){
						self.getView().setBusy(false);
								
					}
					});
			
			
		},
		
		
		onRejectPress: function(oEvent){
			var oAction= oEvent.getSource().data("action");
			var oStatus= this.getView().getModel("DatiGeneraliSet").getData().SAM;
			
			//if(oStatus === 'A3'){ 
			//	this.openDialog("YVERT_WFI_GM_UI.view.fragment.Dialog.RejectRequestSubmitDialogFpf").open();
			//}else{ 
			//	this.openDialog("YVERT_WFI_GM_UI.view.fragment.Dialog.RejectRequestSubmitDialog").open();			
			//}
			this.openDialog("YVERT_WFI_GM_UI.view.fragment.Dialog.RejectRequestSubmitDialog").open();
			
		},
		
		onOpenDetail: function(oEvent){
		
				
			this.openDialog("YVERT_WFI_GM_UI.view.fragment.Dialog.detail.OpenCFDetailDialog").open();			

		},

		
		OnComboChange: function(oEvent){
			
			var self = this,
			oSection= oEvent.getSource().data("section"),
			AddField= oEvent.getSource().data("add") === "X" ? true : false,
			section = AddField ? "Add" + oSection : oSection,
			sfields=AddField ? self._getRequiredFields(section, sap.ui.getCore()) : self._getRequiredFields(section, this.getView()),
			//sfields= self._getRequiredFields(sectionAdd, sap.ui.getCore()),
			//sSocietaVendite = sfields.SocietaVendite === undefined || sfields.SocietaVendite.getSelectedKey() === '' ? false : true,
			sSocieta = sfields.Societa === undefined || sfields.Societa.getSelectedKey() === '' ? false : true,
			//sDivisioneAcquisti = sfields.DivisioneAcquisti === undefined || sfields.DivisioneAcquisti.getSelectedKey() === '' ? false : true,
			filters= [];
			
		

			if(section === "DatiVenditeSet" || section === "AddDatiVenditeSet") {
				sfields.Societa.setValueState(sap.ui.core.ValueState.None) 
				filters.push( new sap.ui.model.Filter({path:"Societa", operator: sap.ui.model.FilterOperator.EQ ,value1:sfields.Societa.getSelectedKey()}));
				filters.push( new sap.ui.model.Filter({path:"Tipo", operator: sap.ui.model.FilterOperator.EQ ,value1:"A"}));
				filters.push( new sap.ui.model.Filter({path:"Domain", operator: sap.ui.model.FilterOperator.EQ ,value1:"VKORG"}));
				self.getView().setBusy(true);
				self.readConditionSelect(filters,section);
				
				var ofilters= [];
				ofilters.push( new sap.ui.model.Filter({path:"Domain", operator: sap.ui.model.FilterOperator.EQ ,value1:"DWERK"}));
				ofilters.push( new sap.ui.model.Filter({path:"Value", operator: sap.ui.model.FilterOperator.EQ ,value1:sfields.Societa.getSelectedKey()}));
				self.readDivConv(ofilters, section);
				
				
			}else if(section === "DatiAcquistiSet" || section === "AddDatiAcquistiSet"){

				filters.push( new sap.ui.model.Filter({path:"Value", operator: sap.ui.model.FilterOperator.EQ ,value1:sfields.Societa.getSelectedKey()}));
				filters.push( new sap.ui.model.Filter({path:"Domain", operator: sap.ui.model.FilterOperator.EQ ,value1:"WERKS"}));
				self.getView().setBusy(true);
				self.readConditionSelect(filters,section);
				/*if(section === "DatiVenditeSet" || section === "AddDatiVenditeSet"){ 
					var ofilters= [];
					ofilters.push( new sap.ui.model.Filter({path:"Domain", operator: sap.ui.model.FilterOperator.EQ ,value1:"VTWEG"}));
					ofilters.push( new sap.ui.model.Filter({path:"Value", operator: sap.ui.model.FilterOperator.EQ ,value1:sfields.SocietaVendite.getSelectedKey()}));
					self.readDivVend(ofilters, section);
				}*/
				

			}

		},
		
		OnSelectSV: function (oEvent){
			var self = this,
			AddField= oEvent.getSource().data("add") === "X" ? true : false,
			oSection= oEvent.getSource().data("section"),	
			section = AddField ? "Add" + oSection : oSection,
			SV = oEvent.getSource().getSelectedKey(),
			sfields=AddField ? self._getRequiredFields(section, sap.ui.getCore()) : self._getRequiredFields(section, this.getView()),
			sSocieta = sfields.Societa === undefined || sfields.Societa.getSelectedKey() === '' ? false : true;
			oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
			if(sSocieta){
				
				if(section === "DatiVenditeSet" || section === "AddDatiVenditeSet"){ 
					self.readField(section,"VTWEG","A", sfields.Societa.getSelectedKey(),SV);

				}
			}
		},
		
		
		onChkSelect: function(oEvent){
			var oTempModel= this.getView().getModel("temp"),
			oType = oEvent.getSource().data("type"),
			oSection = oEvent.getSource().data("section"),
			AddField= oEvent.getSource().data("add") === "X" ? true : false,
			oSelected= oEvent.getSource().getSelected();
			
			if(oType === "CI") {
				oSelected ? oTempModel.setProperty("/FlagInvestimento", "X") : oTempModel.setProperty("/FlagInvestimento", "");
				AddField ? sap.ui.getCore().byId("dialogAddPurchase13").setSelectedKey(null) : this.getView().byId("dialogPurchase13").setSelectedKey(null);
				AddField ? sap.ui.getCore().byId("dialogAddPurchase14").setSelectedKey(null) : this.getView().byId("dialogPurchase14").setSelectedKey(null);
				AddField ? sap.ui.getCore().byId("dialogAddPurchase15").setSelectedKey(null) : this.getView().byId("dialogPurchase15").setSelectedKey(null);
			}else {
				oSelected ? oTempModel.setProperty("/FlagEsercizio", "X") : oTempModel.setProperty("/FlagEsercizio", "");
				AddField ? sap.ui.getCore().byId("dialogAddPurchase2").setSelectedKey(null) : this.getView().byId("dialogPurchase2").setSelectedKey(null);
				AddField ? sap.ui.getCore().byId("dialogAddPurchase5").setSelectedKey(null) : this.getView().byId("dialogPurchase5").setSelectedKey(null);
				AddField ? sap.ui.getCore().byId("dialogAddPurchase6").setSelectedKey(null) : this.getView().byId("dialogPurchase6").setSelectedKey(null);
			}
			

			
		},
		
		OnGetCoge: function(oEvent){
			
			var selectedKey= oEvent.getSource().getSelectedKey(),
			Inv= oEvent.getSource().data("Inv"),
			AddField= oEvent.getSource().data("add") === "X" ? true : false,
			oSection= oEvent.getSource().data("section"),
			oSectionAdd= "Add" + oSection,
			sField= oEvent.getSource().data("field"),
			oEntry = AddField ? this._getEntries(oSectionAdd,"R",sap.ui.getCore()) : this._getEntries(oSection,"R",this.getView()),
			oModel = AddField ? oEvent.getSource().getModel("MatchCodesAdd" + sField).getData() : oEvent.getSource().getModel("MatchCodes" + sField).getData(),
			obj= _.findWhere(oModel, {Name: selectedKey}),
			sCodCoge = obj.Name2,
			sDescCoge = obj.Value2;
			if(Inv === "X"){
				oEntry.ContoCoGeInvestimento.setValue(sCodCoge);     
				oEntry.DescrizioneContoCoGeInvestimento.setValue(sDescCoge);
			}else{
				oEntry.ContoCoGe.setValue(sCodCoge);     
				oEntry.DescrizioneContoCoGe.setValue(sDescCoge);
			}
			
			oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
			
		},
		
		OnSelectUser: function(oEvent){
			var oValue = oEvent.getSource().getSelectedKey(),
			oTempModel= this.getView().getModel("temp");
			
			oValue === "FPA" ? oTempModel.setProperty("/SendToFPA", "X") : oTempModel.setProperty("/SendToFPA", "");

		},
		OnTxtMotivation: function(oEvent){
			var oValue = oEvent.getSource().getValue(),
			oTempModel= this.getView().getModel("temp");			
			oTempModel.setProperty("/TestoRifiuto", oValue);

		},
		
		
		onApproveRejectPress: function(oEvent){
			var oDataModel= this.getView().getModel(),
			oAction= oEvent.getSource().data("action"),
			oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle(),
			sCodiceMateriale = this.getView().getModel("DatiGeneraliSet").getData().CodiceMateriale,
			oTempModel= this.getView().getModel("temp"),
			sTestoRifiuto= oTempModel.getProperty("/TestoRifiuto"),
			//BEGIN MP - RESETTO L'FPA DEL TEMP MODEL IN CASO DI APPROVAZIONE
			// sSendToFPA = oTempModel.getProperty("/SendToFPA"),
			//END MP - RESETTO L'FPA DEL TEMP MODEL IN CASO DI APPROVAZIONE
			oEntry= null;
			
			//BEGIN MP - RESETTO L'FPA DEL TEMP MODEL IN CASO DI APPROVAZIONE
			if(oAction.charAt(0) === 'A'){
				oTempModel.setProperty("/SendToFPA", "");
				var sSendToFPA = oTempModel.getProperty("/SendToFPA");
			}else {
				var sSendToFPA = oTempModel.getProperty("/SendToFPA");
			}
			//END MP - RESETTO L'FPA DEL TEMP MODEL IN CASO DI APPROVAZIONE
			
			 var oPath = oDataModel.createKey("/CambioStatoSet", {
				 CodiceMateriale: sCodiceMateriale
                 });
			 
			 oEntry = {SAM: oAction, SendToFPA: sSendToFPA, TestoRifiuto: sTestoRifiuto};

			if(oAction.charAt(0) === 'R'){
				var checkRejectFields = this.checkRejectFields();
				if(!checkRejectFields){
					
					var msg = oResourceBundle.getText("CreationErrorMessageBox");
					MessageToast.show(msg);

				}else {
					this._onApproveRejectPress(oPath,oDataModel, oEntry, this, MessageBox);
				}

			}else {
				this._onApproveRejectPress(oPath,oDataModel, oEntry, this, MessageBox);
			}
			
		},
		
		checkRejectFields: function(){
			var check = true,
			BoxChooseUser= sap.ui.getCore().byId("BoxBackToUser").getVisible(),
			oMotivation= sap.ui.getCore().byId("txtMotivation").getValue(),
			ComboUser= sap.ui.getCore().byId("comboBackToUser").getSelectedKey();
			
			if(BoxChooseUser === true && (oMotivation === '' || ComboUser === '')){
				check = false;
			}else if(BoxChooseUser === false && oMotivation === ''){
				check = false;
			}
			return check
		},
		

		onSuccess: function (oSection) {
			
			var IconTabBar= this.getView().byId("IconTabBar"),
			oTempModel = this.getView().getModel("temp");
			
			if(oSection !== undefined){
				var oSection = oSection.substring(1);
				oSection === "DatiAcquistiSet" ? oTempModel.setProperty("/IsSocietaASelected", false) : oTempModel.setProperty("/IsSocietaSelected", false);

					if(this.getView().getModel("SocietaSetAdd" + oSection) !== undefined){
						this.getView().getModel("SocietaSetAdd" + oSection).setProperty("/", []);
					}
					if(this.getView().getModel("AddDivisioneVenditeSet") !== undefined){
						this.getView().getModel("AddDivisioneVenditeSet").setProperty("/", []);
					}

					if(this.getView().getModel("SocietaSet" + oSection) !== undefined){
						this.getView().getModel("SocietaSet" + oSection).setProperty("/", []);
					}
					if(this.getView().getModel("DivisioneVenditeSet") !== undefined){
						this.getView().getModel("DivisioneVenditeSet").setProperty("/", []);
					}

					this.getView().getModel("temp").setProperty("/FPAList", []);
					this.getView().getModel("temp").setProperty("/FPVList", []);

			}
			
			
			this._bindSection("DatiGeneraliSet");
			//IconTabBar.setSelectedKey("DatiGeneraliSet");
			this.getView().setBusy(false);
			

		},
		
		onEditSuccess: function (oSection) {
			
			var IconTabBar= this.getView().byId("IconTabBar");

			this._bindSection("DatiGeneraliSet");

			this.getView().setBusy(false);
			

		},

				
		onSectionEditPress: function (oEvent) {
			
			var oTempModel= this.getView().getModel("temp"),
			oBtnType = oEvent.getSource().getText(),
			oSection= oEvent.getSource().data("datapathmodel"),
			oSectionDet= oEvent.getSource().data("datapathmodelDet"),
			sSAM = this.getView().getModel("DatiGeneraliSet").getData().SAM;
			sSAM === "R3" ? oTempModel.setProperty("/RifiutoFPF", true) : oTempModel.setProperty("/RifiutoFPF", false);
			// BEGIN MP - GESTIONE CAMPI PROVENIENTI DAL MATCHCODE IVA
			if ( oTempModel.getProperty("/IvaVendite").Changed === "" && oTempModel.getProperty("/IsVisibleDetailDatiVenditeSet") === true ) {

				this.getView().getModel("temp").setProperty("/IvaVendite/CodiceIvaVendite", this.getView().getModel("DatiVenditeSetDetail").getData().CodiceIvaVendite );
				this.getView().getModel("temp").setProperty("/IvaVendite/CodiceIvaAcquisti", this.getView().getModel("DatiVenditeSetDetail").getData().CodiceIvaAcquisti );
				this.getView().getModel("temp").setProperty("/IvaVendite/ReverseCharge", this.getView().getModel("DatiVenditeSetDetail").getData().ReverseCharge === "X" ? "SI" : "NO" );
				this.getView().getModel("temp").setProperty("/IvaVendite/Detrazione", this.getView().getModel("DatiVenditeSetDetail").getData().Detrazione  === "X" ? "SI" : "NO" );
				this.getView().getModel("temp").setProperty("/IvaVendite/DescrizioneMWST", this.getView().getModel("DatiVenditeSetDetail").getData().DescrizioneMWST );
				this.getView().getModel("temp").setProperty("/IvaVendite/DescrizioneIvaAcquisti", this.getView().getModel("DatiVenditeSetDetail").getData().DescrizioneIvaAcquisti );
				
			}
			// END MP - GESTIONE CAMPI PROVENIENTI DAL MATCHCODE IVA
			if (oBtnType === "Modifica") {
				oTempModel.setProperty("/isClicked/" + oSection, true);
				oTempModel.setProperty("/Enabled/" + oSection, true);
			}
			else {

				var oDataModel= this.getView().getModel(),
				oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle(),				
				oEntry = this._getEntries(oSection,"",this.getView()),
				sCodiceMateriale = this.getView().getModel("DatiGeneraliSet").getData().CodiceMateriale;
				
				
				switch(oSection){
					case "DatiVenditeSet":
					
					var sSocietaVendite = this.getView().getModel(oSectionDet).getData().SocietaVendite,
					sDivisioneVendite = this.getView().getModel(oSectionDet).getData().DivisioneVendite;
					
					 var oPath = oDataModel.createKey("/" + oSection, {
						 CodiceMateriale: sCodiceMateriale,
						 SocietaVendite: sSocietaVendite,
						 DivisioneVendite: sDivisioneVendite
		                 });
					 break;
						
					case "DatiAcquistiSet":
						
						var sDivisioneAcquisti = this.getView().getModel(oSectionDet).getData().DivisioneAcquisti;
						
						 var oPath = oDataModel.createKey("/" + oSection, {
							 CodiceMateriale: sCodiceMateriale,
							 DivisioneAcquisti: sDivisioneAcquisti
			                 });
						break;
					default:
						
						 var oPath = oDataModel.createKey("/" + oSection, {
							 CodiceMateriale: sCodiceMateriale
			                 });
						break;
				}
				
				oTempModel.setProperty("/isClicked/" + oSection, false);
				oTempModel.setProperty("/Enabled/" + oSection, false);
				
				if (oSection === "DatiAcquistiSet") {
					
					var checkDetailFields = this._checkDetailFields(oSection),
					oEs = this.getView().getModel("temp").getProperty("/FlagEsercizio") === "X" ? true : false,
					oInv = this.getView().getModel("temp").getProperty("/FlagInvestimento") === "X" ? true : false;
					
					if (oEs || oInv) {
						
						if (checkDetailFields) {
							
							this._onSectionEditPress(oPath, oDataModel, oEntry, oSection, this, MessageBox);
						
						}else {
							MessageBox.error(oResourceBundle.getText("CreationErrorMessageBox"),{
									icon: MessageBox.Icon.ERROR,
									title: oResourceBundle.getText("createMaterialDialogTitle"),
									actions: [sap.m.MessageBox.Action.CLOSE],								
									styleClass: ""
								});
							
							}
						
					}else{
						MessageBox.error(oResourceBundle.getText("CreationErrorMessageBoxConto"),{
							icon: MessageBox.Icon.ERROR,
							title: oResourceBundle.getText("createMaterialDialogTitle"),
							actions: [sap.m.MessageBox.Action.CLOSE],								
							styleClass: ""
						});

					}
					
					
				}else{
					this._onSectionEditPress(oPath, oDataModel, oEntry, oSection, this, MessageBox);
				}
				
				
				
			}
		},
		
		OnCreate: function (oEvent) {
			var oTempModel= this.getView().getModel("temp"),
				oDataModel= this.getView().getModel(),
				oSection= oEvent.getSource().data("datapathmodel"),
				oAdd= oEvent.getSource().data("add") === "X" ? true : false,
				oPath = "/" + oSection,
				oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle(),				
				oEntry = oAdd ? this._getEntries("Add"+ oSection,"",sap.ui.getCore()) : this._getEntries(oSection,"C",this.getView()),
				checkDetailFields = oAdd ? this._checkDetailFields("Add" + oSection) : this._checkDetailFields(oSection),
				oEs = oEntry.ContoEsercizio ? true : false,
				oInv = oEntry.ContoInvestimento ? true : false;
				


				if (oSection === "DatiAcquistiSet") {
					if (oEs || oInv){
						if (checkDetailFields) {
							
							this._OnCreate(oPath, oDataModel, oEntry, this, MessageBox);
						
						}else {
							MessageBox.error(oResourceBundle.getText("CreationErrorMessageBox"),{
									icon: MessageBox.Icon.ERROR,
									title: oResourceBundle.getText("createMaterialDialogTitle"),
									actions: [sap.m.MessageBox.Action.CLOSE],								
									styleClass: ""
								});
							
							}
					}else{
						MessageBox.error(oResourceBundle.getText("CreationErrorMessageBoxConto"),{
							icon: MessageBox.Icon.ERROR,
							title: oResourceBundle.getText("createMaterialDialogTitle"),
							actions: [sap.m.MessageBox.Action.CLOSE],								
							styleClass: ""
						});

					}
					
					
				}else{
					
					if (checkDetailFields) {
						
						this._OnCreate(oPath, oDataModel, oEntry, this, MessageBox);
					
					}else {
						MessageBox.error(oResourceBundle.getText("CreationErrorMessageBox"),{
								icon: MessageBox.Icon.ERROR,
								title: oResourceBundle.getText("createMaterialDialogTitle"),
								actions: [sap.m.MessageBox.Action.CLOSE],								
								styleClass: ""
							});
						
						}
					
				}
				
			},
			_checkDetailFields: function (section) {
				var self = this,
					check = true;
				if(section === "DatiAcquistiSet" || section === "AddDatiAcquistiSet"){
					var sDivisioneAcquisti = section === "DatiAcquistiSet" ? self.getView().byId("dialogPurchase1") : sap.ui.getCore().byId("dialogAddPurchase1"),
					sClasseVal = section === "DatiAcquistiSet" ? self.getView().byId("dialogPurchase2") : sap.ui.getCore().byId("dialogAddPurchase2"),
					sSocieta = section === "DatiAcquistiSet" ? self.getView().byId("dialogPurchase12") : sap.ui.getCore().byId("dialogAddPurchase12"),
					sFP = sap.ui.getCore().byId("dialogAddPurchase10"),
					sFPVBox = sap.ui.getCore().byId("FPListV"),
					checkS = sSocieta.getSelectedItem() !== null ? true : false,
					checkDA = sDivisioneAcquisti.getSelectedItem() !== null ? true : false,
					checkCV = sClasseVal.getSelectedItem() !== null ? true : false,
					oEs = this.getView().getModel("temp").getProperty("/FlagEsercizio") === "X" ? true : false,
					oInv = this.getView().getModel("temp").getProperty("/FlagInvestimento") === "X" ? true : false;
					if (sFPVBox !== undefined) {
						var checksFP = sFPVBox.getVisible();
					}
					
					if (!checkS) {
						sSocieta.setValueState(sap.ui.core.ValueState.Error);
						check = false;
					} else
						sSocieta.setValueState(sap.ui.core.ValueState.None);
					if (!checkDA) {
						sDivisioneAcquisti.setValueState(sap.ui.core.ValueState.Error);
						check = false;
					} else
						sDivisioneAcquisti.setValueState(sap.ui.core.ValueState.None);
						
					
					if (oEs) {
						if (!checkCV) {
							sClasseVal.setValueState(sap.ui.core.ValueState.Error);
							check = false;
						} else
							sClasseVal.setValueState(sap.ui.core.ValueState.None);
					}

					if (oInv) {
						var sClasseValInv = section === "DatiAcquistiSet" ? self.getView().byId("dialogPurchase13") : sap.ui.getCore().byId("dialogAddPurchase13"),
						checkDVI = sClasseValInv.getSelectedKey() !== "" ? true : false;
						if (!checkDVI) {
							sClasseValInv.setValueState(sap.ui.core.ValueState.Error);
							check = false;
						} else
							sClasseValInv.setValueState(sap.ui.core.ValueState.None);
					} 
	
					if(sFPVBox !== undefined){
						if (checksFP && sFP.getTokens().length === 0) {
							sFP.setValueState(sap.ui.core.ValueState.Error);
							check = false;
						} else
							sFP.setValueState(sap.ui.core.ValueState.None);
					}
					
					
					
				}else if(section === "AddDatiVenditeSet"){
										
					var sSocietaVendite = sap.ui.getCore().byId("dialogAddSales1"),
					sCanaleDis= sap.ui.getCore().byId("dialogAddSales2"),
					sDivisioneVend= sap.ui.getCore().byId("dialogAddSales3"),
					sGruppoCont= sap.ui.getCore().byId("dialogAddSales5"),
					sClassFiscale= sap.ui.getCore().byId("dialogAddSales6"),
					sSocieta = sap.ui.getCore().byId("dialogAddSales13"),
					sFP = sap.ui.getCore().byId("dialogAddSales10"),
					sFPABox = sap.ui.getCore().byId("FPListA"),
					checkS = sSocieta.getSelectedItem() !== null ? true : false,
					checkSV = sSocietaVendite.getSelectedItem() !== null ? true : false,
					checkCD = sCanaleDis.getSelectedItem() !== null ? true : false,
					checkDV = sDivisioneVend.getSelectedItem() !== null ? true : false,
					checkGDC = sGruppoCont.getValue() !== null ? true : false,
					checkCF = sClassFiscale.getValue() !== "" ? true : false;
					if (sFPABox !== undefined) {
						var checksFP = sFPABox.getVisible();
					}
					
					if (!checkS) {
						sSocieta.setValueState(sap.ui.core.ValueState.Error);
						check = false;
					} else
						sSocieta.setValueState(sap.ui.core.ValueState.None);
					if (!checkSV) {
						sSocietaVendite.setValueState(sap.ui.core.ValueState.Error);
						check = false;
					} else
						sSocietaVendite.setValueState(sap.ui.core.ValueState.None);
					
					if (!checkCD) {
						sCanaleDis.setValueState(sap.ui.core.ValueState.Error);
						check = false;
					} else
						sCanaleDis.setValueState(sap.ui.core.ValueState.None);
					
					if (!checkDV) {
						sDivisioneVend.setValueState(sap.ui.core.ValueState.Error);
						check = false;
					} else
						sDivisioneVend.setValueState(sap.ui.core.ValueState.None);
					
					if (!checkGDC) {
						sGruppoCont.setValueState(sap.ui.core.ValueState.Error);
						check = false;
					} else
						sGruppoCont.setValueState(sap.ui.core.ValueState.None);
					
					if (!checkCF) {
						sClassFiscale.setValueState(sap.ui.core.ValueState.Error);
						check = false;
					} else
						sClassFiscale.setValueState(sap.ui.core.ValueState.None);
					

					if(sFPABox !== undefined){
						if (checksFP && sFP.getTokens().length === 0) {
							sFP.setValueState(sap.ui.core.ValueState.Error);
							check = false;
						} else
							sFP.setValueState(sap.ui.core.ValueState.None);
					}
					
				}
					
				

				return check;
			},
			
			onExpand: function (oEvent) {
				
				var section= oEvent.getSource().data("datapathmodel"),
			
				oTempModel= this.getView().getModel("temp");			
				var oDialog = this.openDialog("YVERT_WFI_GM_UI.view.fragment.Dialog.detail.Add" + section + "Dialog");
				/*var sGdC = this.getView().getModel("DatiVenditeSet").getData()[0].GdC;
				var sContoCoGe = this.getView().getModel("DatiVenditeSet").getData()[0].ContoCoGe;
				var sDescrizioneContoCoGe = this.getView().getModel("DatiVenditeSet").getData()[0].DescrizioneContoCoGe;
				var sDescrizioneMWST = this.getView().getModel("DatiVenditeSet").getData()[0].DescrizioneMWST;*/
				oTempModel.setProperty("/FPAList", []);
				oTempModel.setProperty("/FPVList", []);

				if (section === "DatiVenditeSet") {
					oTempModel.setProperty("/IsSocietaSelected", false);
					/*sap.ui.getCore().byId("dialogAddSales5").setValue(null);
					sap.ui.getCore().byId("dialogAddSales6").setValue(null);
					sap.ui.getCore().byId("dialogAddSales7").setValue(null);
					sap.ui.getCore().byId("dialogAddSales8").setValue(null);*/
				}else{
					
					oTempModel.setProperty("/IsSocietaASelected", false);
					oTempModel.setProperty("/FlagInvestimento", false);
					oTempModel.setProperty("/FlagEsercizio", false);
					/*sap.ui.getCore().byId("dialogAddPurchase5").setValue(null);
					sap.ui.getCore().byId("dialogAddPurchase6").setValue(null);
					sap.ui.getCore().byId("dialogAddPurchase14").setValue(null);
					sap.ui.getCore().byId("dialogAddPurchase15").setValue(null);*/
				}
				
				oDialog.open();
			},
			
			
			
			onChkExpand: function (oEvent) {
				
				var oSelected = oEvent.getSource().getSelected(),
				section= oEvent.getSource().data("section"),
				oFPBox = section === "DatiVenditeSet" ? sap.ui.getCore().byId("FPListA") : sap.ui.getCore().byId("FPListV");
				
				oSelected ? oFPBox.setVisible(true) : oFPBox.setVisible(false);
				if(!oSelected){
					this.getView().getModel("temp").setProperty("/FPAList", []);
					this.getView().getModel("temp").setProperty("/FPVList", []);
					
				}
				
				
			},

			//BEGIN MP - NUOVE FUNZIONI PER IL BLOCCO MATERIALE
			onSalesBlock: function(oEvent){
				var oTempModel = this.getOwnerComponent().getModel("temp");
				//oTempModel.setProperty("/SalesBlock", true);
				//oTempModel.setProperty("/TotalBlock", false);
				this.openDialog("YVERT_WFI_GM_UI.view.fragment.Dialog.SalesBlockRequestSubmitDialog").open();
			},
			
			onTotalBlock: function(oEvent){
				var oTempModel = this.getOwnerComponent().getModel("temp");
				//oTempModel.setProperty("/SalesBlock", false);
				//oTempModel.setProperty("/TotalBlock", true);
				this.openDialog("YVERT_WFI_GM_UI.view.fragment.Dialog.TotalBlockRequestSubmitDialog").open();
			},
			
			OnSelectSalesBlock: function(oEvent){
				var oTempModel = this.getOwnerComponent().getModel("temp");
				var oValue = oEvent.getSource().getSelectedKey();
				oTempModel.setProperty("/BlockValue", oValue);
			},	
			
			onSalesBlockConfirm: function (oEvent) {
				var oTempModel = this.getOwnerComponent().getModel("temp");
				var oDataModel = this.getView().getModel();
				
				if (oTempModel.getProperty("/TotalBlock") === true) {
				
					
				} else {

				}
				
			},	
			//END MP - NUOVE FUNZIONI PER IL BLOCCO MATERIALE
			
			handleValueHelp: function(oEvent){
				
				var oSource = oEvent.getSource(),
					oValue= oSource.getValue(),
					sField = oEvent.getSource().data("filterTableField"),
					sName = oSource.data("fieldName");
		
				var oDialog = this.openExpandDialog("YVERT_WFI_GM_UI.view.fragment.MultiInput.ValueHelp" + sName);
					oDialog.open();
				
			},
			
			/*_handleValueHelpCloseListFP : function (evt) {
				
				var that = this,
				oList= evt.getSource().getId(),
				oSelectedItem = evt.getParameter("selectedItems"),
				sField = evt.getSource().data("InputField"),
				oMultiInput = sap.ui.getCore().byId(sField),
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
				}

				this.closeExpandDialog();
			},
			*/
			
			
			/*onCloseDetailAddDialog: function (evt) {
				
				var oSection = evt.getSource().data("section"),
				oTempModel = this.getView().getModel("temp");
				oSection === "DatiAcquistiSet" ? oTempModel.setProperty("/IsSocietaASelected", false) : oTempModel.setProperty("/IsSocietaSelected", false);
				
				
				if(this.getView().getModel("SocietaSetAdd" + oSection) !== undefined){
					this.getView().getModel("SocietaSetAdd" + oSection).setProperty("/", []);
				}
				if(this.getView().getModel("AddDivisioneVenditeSet") !== undefined){
					this.getView().getModel("AddDivisioneVenditeSet").setProperty("/", []);
				}
				this.closeDialog();
			},
			*/
		

	});
});