sap.ui.define([
    "YVERT_WFI_GM_UI/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "YVERT_WFI_GM_UI/util/Formatter",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "YVERT_WFI_GM_UI/util/Filter",
    "sap/ui/export/Spreadsheet",
    "sap/ui/Device",
    "sap/m/Token"
], function(Controller, JSONModel,Formatter,MessageBox,Filter,FilterOperator,FilterUtils,Spreadsheet,Device, Token) {
    "use strict";
    return Controller.extend("YVERT_WFI_GM_UI.controller.Home", {
        __targetName: "homepage",
        formatter: Formatter,
        FilterUtils: FilterUtils,
        onRouteMatched: function(){
            var oTempModel = this.getOwnerComponent().getModel("temp");
            oTempModel.setProperty("/IsDetail", false);
            oTempModel.setProperty("/IsSocietaSelected", false);
            oTempModel.setProperty("/IsSocietaASelected", false);
            oTempModel.setProperty("/IsDVSelected", false);
            oTempModel.setProperty("/isClicked/DatiGeneraliSet", false);
            oTempModel.setProperty("/isClicked/DatiVenditeSet", false);
            oTempModel.setProperty("/isClicked/DatiAcquistiSet", false);
            oTempModel.setProperty("/Enabled/DatiGeneraliSet", true);
            oTempModel.setProperty("/Enabled/DatiVenditeSet", true);
            var oDataModel = this.getOwnerComponent().getModel();
            this._takeAuthorizations();
            if(oTempModel.getData().canReload){
                this.onFilterBarSearch();
            }
        },
        onAfterRendering: function(){
            if(sap.ui.getCore().sCurrentLevel==="2"){
                this.getRouter().navTo("detail",{
                    codicemateriale:sap.ui.getCore().CodiceMateriale
                    })
            }
        },
        _showDetail : function (oEvent) {
            var oItem = oEvent.getSource(),
            oObject = oItem.getBindingContext("HomePageSet").getObject();
                this.getRouter().navTo("detail", {
                    codicemateriale: oObject.CodiceMateriale
                });
        },
        OnliveChange: function(oEvent){
            var oSource = oEvent.getSource(),s
                sName = oSource.data("fieldName"),
                sField = oEvent.getSource().data("filterTableField"),
                oValue = oSource.getValue();
            if(sField !== "CodiceMateriale"){
                var sFieldD = "Descrizione" + sField;
            }
            var aSingleFilter = [{Path: sFieldD, Operator: sap.ui.model.FilterOperator.Contains,Value1 : oValue , Value2:"",title : oValue}];
            this.FilterUtils.refreshInFilterModel(this, sField);
            this.FilterUtils.putInFilterModel(this, sField, aSingleFilter);
        },
        handleValueHelp: function(oEvent){
            var oSource = oEvent.getSource(),
                oValue= oSource.getValue(),
                sField = oEvent.getSource().data("filterTableField"),
                sName = oSource.data("fieldName");
                if(sName !== "FPAList"){
                    this.FilterUtils.refreshInFilterModel(this, sField);
                    var oDialog = this.openDialog("YVERT_WFI_GM_UI.view.fragment.MultiInput.ValueHelp" + sName);
                }else{
                    var oDialog = this.openExpandDialog("YVERT_WFI_GM_UI.view.fragment.MultiInput.ValueHelp" + sName);
                }
                oDialog.open();
        },
        handleValueHelpCIVAVND: function(oEvent){
            var oSource = oEvent.getSource(),
                oValue= oSource.getValue(),
                sField = oEvent.getSource().data("filterTableField"),
                sName = oSource.data("fieldName");
                var oDialog = this.openCIVAVNDDialog("YVERT_WFI_GM_UI.view.fragment.MultiInput.ValueHelp" + sName);
                oDialog.open();
        },
        /*_handleValueHelpCloseStatus : function (evt) {
            var that = this,
            oSelectedItem = evt.getParameter("selectedItems"),
            sField = evt.getSource().data("filterTableField"),
            oMultiInput = this.getView().byId(sField),
            aFilters=[];
            //this.embtyMultiInputControl(this, sField);
            oMultiInput.setTokens([]);
            this.FilterUtils.refreshInFilterModel(that, sField);
            if (oSelectedItem && oSelectedItem.length > 0) {
                oSelectedItem.forEach(function (oItem) {
                    oMultiInput.addToken(new Token({
                        text: oItem.getTitle(),
                        key: oItem.data("key")
                    }));
                aFilters.push({Path: sField, Operator: "EQ",Value1 : oItem.data("key"), Value2:"",title : oItem.getTitle()});
                });
                this.FilterUtils.refreshInFilterModel(that, sField);
                this.FilterUtils.putInFilterModel(that, sField, aFilters);  
            }
            this.closeDialog();
        },*/
        _handleValueHelpCloseStatus : function (evt) {
            var that = this,
            oSelectedItem = evt.getParameter("selectedItems"),
            sField = evt.getSource().data("filterTableField"),
            oMultiInput = this.getView().byId(sField),
            aFilters=[];
            this.embtyMultiInputControl(this, sField);
            this.FilterUtils.refreshInFilterModel(that, sField);
            if (oSelectedItem && oSelectedItem.length > 0) {
                oSelectedItem.forEach(function (oItem) {
                    oMultiInput.addToken(new Token({
                        text: oItem.getTitle(),
                        key: oItem.data("key")
                    }));
                aFilters.push({Path: sField, Operator: "EQ",Value1 : oItem.data("key"), Value2:"",title : oItem.getTitle()});
                });
                this.FilterUtils.refreshInFilterModel(that, sField);
                this.FilterUtils.putInFilterModel(that, sField, aFilters);  
            }
            this.closeDialog();
        },
        onEditToken: function (evt) {
             var sField= evt.getSource().data("fieldName");
            if(evt.getParameters().type ==="removed"){
                var ModelFilters= this.getView().getModel("oFieldFilterModel").getProperty("/filters/" + sField),
                removedItem = evt.getParameters().removedTokens[0].getKey(),
                NewFilters= _.filter(ModelFilters, function(num){ return num.Value1 !== removedItem;});
                this.FilterUtils.refreshInFilterModel(this, sField);
                this.FilterUtils.putInFilterModel(this, sField, NewFilters);
            }
        },
        

        onFilterBarSearch: function(){
            var oTable = this.getView().byId("materialTable"),
                allFilters = this.FilterUtils._generateAllFilter(this, Filter),
                oTempModel= this.getView().getModel("temp");
            this.getView().setBusy(true);
            this.read(allFilters.aFilters); 
            oTempModel.setProperty("/ViewExport",true);
        },
        onResetFilter: function(oEvent){
            //Set empty filter model    
            var aAllFilterFields = this.FilterUtils.getAllFitersFields(this),
                sFieldName;
            for(var i = 0 ; i < aAllFilterFields.length ; i++){
                sFieldName = aAllFilterFields[i];
                this.FilterUtils.refreshInFilterModel(this, sFieldName);
                if(sFieldName === 'SAM' || sFieldName === 'DescrizioneMateriale'){
                    this.embtyMultiInputControl(this, sFieldName);
                }else{
                    this.setEmptyObject(this, sFieldName);
                }
            }
        },
        onSingleReset: function(oEvent){
            var sFieldName = oEvent.getSource().data("BtnFor");
            this.FilterUtils.refreshInFilterModel(this, sFieldName);
            if(sFieldName === 'SAM' || sFieldName === 'DescrizioneMateriale'){
                this.embtyMultiInputControl(this, sFieldName);
            }else{
                this.setEmptyObject(this, sFieldName);
            }
        },
        embtyMultiInputControl: function(controller,sId){
            var oControl = controller.getView().byId(sId);      
                oControl.setTokens([]);
        },
        setEmptyObject: function(oController, sId){
            sId = (sId !== 'CommitDate') ? sId : 'fDateFromMoreFunc';
            var oControl = oController.getView().byId(sId);
            if(sId === "ContoInvestimento"){
            	oControl.setValue(0);
            	this.getView().getModel("temp").setProperty('/TipoConto',"Tutto")
            	
            }else{
            	oControl.setValue(null);
            }
        },
        OnComboChange: function(oEvent){
            var self = this,
            section= oEvent.getSource().data("section"),
            sfields= self._getRequiredFields(section, sap.ui.getCore()),
            //sSocietaVendite = sfields.SocietaVendite === undefined || sfields.SocietaVendite.getSelectedKey() === '' ? false : true,
            sSocieta = sfields.Societa === undefined || sfields.Societa.getSelectedKey() === '' ? false : true,
            filters= [];
            
            if(this.getView().getModel("MatchCodesGCM") !== undefined){
				this.getView().getModel("MatchCodesGCM").setProperty("/", []);
			}
			if(this.getView().getModel("MatchCodesCIVAVND") !== undefined){
				this.getView().getModel("MatchCodesCIVAVND").setProperty("/", []);
			}
			sap.ui.getCore().byId("dialogSales6").setValue(null);
			sap.ui.getCore().byId("dialogSales7").setValue(null);
			sap.ui.getCore().byId("dialogSales8").setValue(null);
			sap.ui.getCore().byId("dialogSales9").setTokens([]);
            
            if(sSocieta){
                sfields.Societa.setValueState(sap.ui.core.ValueState.None);
                filters.push( new sap.ui.model.Filter({path:"Societa", operator: sap.ui.model.FilterOperator.EQ ,value1:sfields.Societa.getSelectedKey()}));
                filters.push( new sap.ui.model.Filter({path:"Tipo", operator: sap.ui.model.FilterOperator.EQ ,value1:"A"}));
                filters.push( new sap.ui.model.Filter({path:"Domain", operator: sap.ui.model.FilterOperator.EQ ,value1:"VKORG"}));
                self.getView().setBusy(true);
                self.readConditionSelect(filters,section);
                if(section === "DatiVenditeSet" || section === "AddDatiVenditeSet"){ 
                    var ofilters= [];
                    ofilters.push( new sap.ui.model.Filter({path:"Domain", operator: sap.ui.model.FilterOperator.EQ ,value1:"DWERK"}));
                    ofilters.push( new sap.ui.model.Filter({path:"Value", operator: sap.ui.model.FilterOperator.EQ ,value1:sfields.Societa.getSelectedKey()}));
                    self.readDivConv(ofilters, section);
                }
            }
        },
        OnSelectSV: function (oEvent){
            var self = this,
            section= oEvent.getSource().data("section"),    
            SV = oEvent.getSource().getSelectedKey(),
            sfields= self._getRequiredFields(section, sap.ui.getCore()),
            sSocieta = sfields.Societa === undefined || sfields.Societa.getSelectedKey() === '' ? false : true;
            oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
            if(sSocieta){
                if(section === "DatiVenditeSet" || section === "AddDatiVenditeSet"){ 
                    self.readField(section,"VTWEG","A", sfields.Societa.getSelectedKey(),SV);
                }
            }
        },
        OnSelectSM: function (oEvent){
            var self = this,
            section= oEvent.getSource().data("section"),    
            DV = oEvent.getSource().getSelectedKey(),
            sfields= self._getRequiredFields(section, sap.ui.getCore()),
            sSocieta = sfields.Societa === undefined || sfields.Societa.getSelectedKey() === '' ? false : true,
            sSocietaVendite = sfields.SocietaVendite === undefined || sfields.SocietaVendite.getSelectedKey() === '' ? false : true;
            oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
            if(sSocieta && sSocietaVendite){
                this.getView().getModel("temp").setProperty("/IsDVSelected", true);
                self.readField(section,"SETTMRC","A", sfields.Societa.getSelectedKey(),sfields.SocietaVendite.getSelectedKey(),DV);
            }
        },
        OnGetCoge: function(oEvent){
            var selectedKey= oEvent.getSource().getSelectedKey(),
            oSection= oEvent.getSource().data("section"),
            sField= oEvent.getSource().data("field"),
            oEntry = this._getEntries(oSection,"R",sap.ui.getCore()),
            oModel = oEvent.getSource().getModel("MatchCodes" + sField).getData(),
            obj= _.findWhere(oModel, {Name: selectedKey}),
            sCodCoge = obj.Name2,
            sDescCoge = obj.Value2;
            oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
            oEntry.ContoCoGe.setValue(sCodCoge);     
            oEntry.DescrizioneContoCoGe.setValue(sDescCoge);
        },
        onButtonCreate: function(oEvent){
            var oDialog = this.openDialog("YVERT_WFI_GM_UI.view.fragment.Dialog.home.AddMaterialDialog");
            oDialog.open();
        },
        onSave: function (oEvent) {
            var oTempModel= this.getView().getModel("temp"),
                oDataModel= this.getView().getModel(),
                oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle(),                
                oGeneralPath= "/DatiGeneraliSet",
                oSalesPath= "/DatiVenditeSet",
                oRequiredFields = this._getRequiredFields("All"),
                checkFields = this.checkDialogFields(oRequiredFields);
                if (checkFields) {
                    var oGeneralEntry = this._getEntries("DatiGeneraliSet","C",sap.ui.getCore());
                    var oSalesEntry = this._getEntries("DatiVenditeSet","C",sap.ui.getCore());
                this._OnFirstCreate(oGeneralPath, oSalesPath, oDataModel, oGeneralEntry, oSalesEntry, this, MessageBox);
                }else {
                    MessageBox.error(oResourceBundle.getText("CreationErrorMessageBox"),{
                            icon: MessageBox.Icon.ERROR,
                            title: oResourceBundle.getText("createMaterialDialogTitle"),
                            actions: [sap.m.MessageBox.Action.CLOSE],                               
                            styleClass: ""
                        });
                    }
            },
            checkDialogFields: function (fields) {
                var self = this,
                    check = true,
                    sDescrizioneMateriale = sap.ui.getCore().byId("dialogGeneral1"),
                    sTipoMateriale = sap.ui.getCore().byId("dialogGeneral2"),
                    //sSettoreM = sap.ui.getCore().byId("dialogGeneral3"),
                    sSocieta = sap.ui.getCore().byId("dialogSales13"),
                    sSocietaVendite = sap.ui.getCore().byId("dialogSales1"),
                    sCanaleDis= sap.ui.getCore().byId("dialogSales2"),
                    sDivisioneVend= sap.ui.getCore().byId("dialogSales3"),
                    sGruppoCont= sap.ui.getCore().byId("dialogSales5"),
                    sClassFiscale= sap.ui.getCore().byId("dialogSales6"),
                    sFPAlList= sap.ui.getCore().byId("dialogSales9");
                    var checkMat = sDescrizioneMateriale.getValue() !== "" ? true : false;
                    var checkTipoMat = sTipoMateriale.getSelectedItem() !== null ? true : false;
                    //var checkSM = sSettoreM.getSelectedItem() !== null ? true : false;
                    var checkS = sSocieta.getSelectedItem() !== null ? true : false;
                    var checkSV = sSocietaVendite.getSelectedItem() !== null ? true : false;
                    var checkCD = sCanaleDis.getSelectedItem() !== null ? true : false;
                    var checkDV = sDivisioneVend.getSelectedItem() !== null ? true : false;
                    var checkGDC = sGruppoCont.getSelectedItem() !== null ? true : false;
                    var checkCF = sClassFiscale.getValue() !== "" ? true : false;
                    var checkFPAlList = this.getView().getModel("temp").getProperty("/FPAList").length !== 0 ? true : false;
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
                    /*if (!checkSM) {
                        sSettoreM.setValueState(sap.ui.core.ValueState.Error);
                        check = false;
                    } else
                        sSettoreM.setValueState(sap.ui.core.ValueState.None);*/
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
                    if (!checkFPAlList) {
                        sFPAlList.setValueState(sap.ui.core.ValueState.Error);
                        check = false;
                    } else
                        sFPAlList.setValueState(sap.ui.core.ValueState.None);
                return check;
            },
            onRefresh : function () {
                var self = this,
                    oView= self.getView(),
                    pathModel = "HomePageSet",
                    oTable = self.byId("materialTable"),
                    oDataModel = this.getOwnerComponent().getModel();
                oView.setBusy(true);
                oDataModel.read("/"+ pathModel, {
                    success: function(data, oResponse){
                            self.onResetFilter();
                            oTable.getBinding("items").filter([]);
                            self.read();
                        oTable.getModel().refresh(true);
                        //this.getView().getModel("temp").setProperty("/FPAList", []);
                        oView.setBusy(false);
                    },
                    error: function(error){
                        oView.setBusy(false);
                    }
                });
            },
            
            _takeReport : function () {
            	
            	var self = this,
            	allFilters = this.FilterUtils._generateAllFilter(this, Filter),
            	filters = allFilters.aFilters,
    			oView = this.getView(),
    				oModel = oView.getModel("report"),
    				oDataModel = oView.getModel();
    				oDataModel.read("/ReportXlsSet",{
    					filters:filters,
    					success: function(data){
    						oModel.setProperty("/", data.results);
    						self.toExcel(data.results);
    						oView.setBusy(false);
    					},
    					error: function(error){
    						oView.setBusy(false);
    					}
    				});
    		},
            toExcel: function (data) {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var oReportModel = this.getView().getModel("report").getProperty("/");
                
                new Spreadsheet({
                    workbook: {
                        columns: this.createColumns()
                    },
                    dataSource: data,
                    fileName: oResourceBundle.getText("appTitle") + ".xlsx",
                        }).build();
              },
              
            createColumns: function() {
            	var aAllLabelField = this.getView().getModel("oFieldReportModel").getProperty("/FieldsLabel"),
                aAllField = this.getView().getModel("oFieldReportModel").getProperty("/Fields"),
                json = [];
	          	for(var i=0; i<aAllLabelField.length; i++){
					json.push({label: aAllLabelField[i],property: aAllField[i]});
				}
            	return json;
            },

               onChangeSlider: function(oEvent) {
                	var oSliderValue = oEvent.getSource().getValue(),
                	sField = oEvent.getSource().data("fieldName"),
                	sValue,
                	aSingleFilter;
                	oSliderValue === 0 ? this.getView().getModel("temp").setProperty('/TipoConto',"Tutto") 
                	: oSliderValue === 1 ? this.getView().getModel("temp").setProperty('/TipoConto',"Conto Esercizio") : 
                		this.getView().getModel("temp").setProperty('/TipoConto',"Conto Investimento");
                	
                	if(oSliderValue !== 0){
                		sValue = oSliderValue === 1 ? "E" : "I";
                		
                		aSingleFilter = [{Path: sField, Operator: "EQ",Value1 : sValue , Value2:"",title : sValue}];
                    	this.FilterUtils.refreshInFilterModel(this, sField);
        				this.FilterUtils.putInFilterModel(this, sField, aSingleFilter);	
                	}else{
                		this.FilterUtils.refreshInFilterModel(this, sField);
                	}
                		
                	
                	
                },
     
    });
});