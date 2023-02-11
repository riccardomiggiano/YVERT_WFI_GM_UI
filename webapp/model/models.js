sap.ui.define([
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/Device"
], function(ResourceModel,JSONModel,ODataModel, Device) {
	"use strict";

	return {

		createResourceModel: function(sBundleName) {
			var oResourceModel = new ResourceModel({
				"bundleUrl": sBundleName
			});
			return oResourceModel;
		},
	
		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		createAuthModel: function (i18nBundle, sizeLimit) {
			return new JSONModel({});
		},
		
		createReportXlsModel: function (i18nBundle, sizeLimit) {
			return new JSONModel({});
		},
		
		createHomeModel: function (i18nBundle, sizeLimit) {
			return new JSONModel({});
		},
		
		createJSONModel: function() {
			var sRootPath = jQuery.sap.getModulePath("YVERT_WFI_GM_UI");
			var oModel = new JSONModel(sRootPath + "/model/mock/mockdata.json");
			return oModel;
		},
		
		createODataModel: function(sUri, parameters) {
			return new ODataModel(sUri, parameters);
		},
		
		createTempModel: function (i18nBundle, sizeLimit) {
			return new JSONModel({
				canReload:false,
				ViewExport:false,
				IsDetail:false,
				IsSocietaSelected: false,
				IsSocietaASelected: false,
				IsDVSelected: false,
				ErrorText: false,
				TestoRifiuto:"",
				FlagInvestimento: "",
				FlagEsercizio: "",
				IsVisibleDetailDatiVenditeSet: false,
				IsVisibleDetailDatiAcquistiSet: false,
				Approvers: [{Key: "FPA", Value: "FP Acquisti"},{Key: "FPV", Value: "FP Vendite"}],
				isClicked:{
					DatiGeneraliSet: false,
					DatiVenditeSet: false,
					DatiAcquistiSet: false
				},
				Enabled: {
					DatiGeneraliSet: true,
					DatiVenditeSet: true,
					DatiAcquistiSet: true
				},
				IvaVendite: {
					Changed: "",
					CodiceIvaVendite: "",
					CodiceIvaAcquisti: "",
					ReverseCharge: "",
					Detrazione: "",
					DescrizioneMWST: "",
					DescrizioneIvaAcquisti: ""
				},
				SendToFPA: "",
				FPAList:[],
				FPVList:[],
				TipoConto: "Tutto",
				RifiutoFPF: false,
				SalesBlock: false,
				TotalBlock: false,
				BlockValue: ""
				//TipoConto: [{Key: "0", Value: "Tutti"},{Key: "1", Value: "Conto Esercizio"},{Key: "2", Value: "Conto Investimento"}]
					
			});
		},
		

		createFilterModel: function (i18nBundle, sizeLimit) {
			return new JSONModel({

				filters: {
					CodiceMateriale: [],	
					DescrizioneMateriale:[],
					SocietaA:[],
					SocietaV:[],
					ContoCoGeA:[],
					ContoCoGeI:[],
					ContoCoGeV:[],
	    			SocietaVendite:[],		
	    			DivisioneVendite:[],
	    			GdC:[],
	    			SAM:[],
	    			ContoInvestimento:[]
					
				},
				filtersField:[	
					'CodiceMateriale',	
	    			'DescrizioneMateriale',
	    			'SocietaA',
	    			'SocietaV',
	    			'ContoCoGeA',
	    			'ContoCoGeI',
	    			'ContoCoGeV',
	    			'SocietaVendite',		
	    			'DivisioneVendite',
	    			'GdC',
	    			'SAM',
	    			'ContoInvestimento'
					]

			});
		},
		
		createReportModel: function (i18nBundle, sizeLimit) {
			return new JSONModel({
				FieldsLabel:[	
					'Codice Materiale',
					'Descrizione Materiale',
					'Stato del Processo',
					'Società Vendite',
					'Descrizione Società Vendite',
					'Organizzazione Commerciale',
					'Descrizione Organizzazione Commerciale',
					'Canale di distribuzione', 
					'Descrizione Canale di distribuzione',
					'Divisione Consegna', 
					'Descrizione Divisione Consegna',
					'Gruppo di Contabilizzazione Materiale', 
					'Descrizione Gruppo di Contabilizzazione Materiale',
					'Co.Ge. Ricavo',
					'Descrizione Co.Ge Ricavo',
					'Società Acquisti',
					'Descrizione Società Acquisti',
					'Divisione Acquisti',
					'Descrizione Divisione Acquisti',
					'Classe Valorizzazione',
					'Descrizione Classe Valorizzazione',
					'Co.Ge. Costo c/esercizio',
					'Descrizione Co.Ge. Costo c/esercizio',
					'Codice Materiale Conto Investimento',
					'Classe Valorizzazione C/I',
					'Descrizione Classe Valorizzazione C/I',
					'Co.Ge. Costo c/investimento',
					'Descrizione Co.Ge. Costo c/investimento', 
					'Clas. Fiscale (MWST - IVA Vendite)', 
					'Codice IVA attiva', 
					'Descrizione Codice IVA attiva',
					'Codice IVA passiva ',
					'Descrizione Codice IVA passiva',
					'Reverse Charge',
					'Detrazione',
					'Clas. Fiscale ( ZRIT - Rit. acconto noli)',
					'Descrizione Clas. Fiscale ( ZRIT - Rit. acconto noli)',
					'Clas. Fiscale ( ZCIT - Lettera esenz. IVA)',
					'Descrizione Clas. Fiscale ( ZCIT - Lettera esenz. IVA)',
					'Clas. Fiscale ( ZCIN - Lettera esenz. IVA)',
					'Descrizione Clas. Fiscale ( ZCIN - Lettera esenz. IVA)',
					'Data Creazione Società Vendite',
					'Data Creazione Società Acquisti',
					'Tipo Materiale',
					'Descrizione Tipo Materiale',
					'Settore Industriale', 
					'Descrizione Settore Industriale', 
					'Gruppo Merci',
					'Descrizione Gruppo Merci',
					'Settore Merceologico',
					'Descrizione Settore Merceologico', 
					'Gruppo Tipi Pos. Gen.',
					'Descrizione Gruppo Tipi Pos. Gen.',
					'Stato Materiale Valido',  
					'Descrizione Stato Materiale',
					'Unità di misura base',
					'Descrizione Unità di misura base',
					'Unità di Peso',
					'Descrizione Unità di Peso',
					'Gruppo statistiche materiale',
					'Descrizione Gruppo statistiche materiale'
					],
					
					Fields:[	
						'CodiceMateriale',
						'DescrizioneMateriale',
						'DescrizioneSAM',
						'SocietaV',
						'DescrizioneSocieta',
						'SocietaVendite',
						'DescrizioneSocietaVendite',
						'DivisioneVendite',
						'DescrizioneDivisioneVendite',
						'DivisioneConsegna',
						'DescrizioneDivisioneConsegna',
						'GdC',
						'DescrizioneGdC',
						'ContoCoGeV',
						'DescrizioneContoCoGe',
						'SocietaA',
						'DescrizioneSocietaA',
						'DivisioneAcquisti',
						'DescrizioneDivisioneAcquisti',
						'ClasseVal',
						'DescrizioneClasseVal',
						'ContoCoGeA',
						'DescrizioneContoCoGeA',
						'CodiceMaterialeI',
						'ClasseValInvestimento',
						'DescrizioneClasseValInvestimento',
						'ContoCoGeInvestimento',
						'DescrizioneContoCoGeInvestimento',
						'MWST',
						'CodiceIvaVendite',
						'DescrizioneIvaVendite',
						'CodiceIvaAcquisti',
						'DescrizioneIvaAcquisti',
						'ReverseCharge',
						'Detrazione',
						'ZRIT',
						'DescrizioneZRIT',
						'ZCIT',
						'DescrizioneZCIT',
						'ZCIN',
						'DescrizioneZCIN',
						'DataCreazioneSocietaVendite',
						'DataCreazioneSocietaAcquisti',
						'TipoMateriale',
						'DescrizioneTipoMateriale',
						'SettoreIndustriale',
						'DescrizioneSettoreIndustriale',
						'GruppoMerci',
						'DescrizioneGruppoMerci',
						'SettoreMerceologico',
						'DescrizioneSettoreMerceologico',
						'TipiPosGenerale',
						'DescrizioneTipiPosGenerale',
						'StatoMateriale',
						'DescrizioneStatoMateriale',
						'UnitaMisura',
						'DescrizioneUnitaMisura',
						'UnitaPeso',
						'DescrizioneUnitaPeso',
						'GSM',
						'DescrizioneGSM'
						]

			});
		}


	};
});