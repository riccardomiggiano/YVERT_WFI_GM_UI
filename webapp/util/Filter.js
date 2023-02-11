sap.ui.define([], function () {
	"use strict";

	return {
		

		
		_resetFilter: function(controller){
			
				//this.refreshInFilterModel();
				this.emptySelectControl(controller,"Materiale");
				this.emptySelectControl(controller,"TipoMateriale");
				this.emptySelectControl(controller,"SocietaA");
				this.emptySelectControl(controller,"SocietaV");
				this.emptySelectControl(controller,"ContoCoGeA");
				this.emptySelectControl(controller,"ContoCoGeI");
				this.emptySelectControl(controller,"ContoCoGeV");
				this.emptySelectControl(controller,"Societa");
				this.emptySelectControl(controller,"DVendite");
				this.emptySelectControl(controller,"GdC");
				this.emptySelectControl(controller,"SAM");
		},

		refreshInFilterModel: function(controller, sFieldName)	{
			
			controller.getView().getModel("oFieldFilterModel").setProperty("/filters/" + sFieldName , []);
			
		},
		
		putInFilterModel: function(controller, sFieldName, oValue)	{
			
			controller.getView().getModel("oFieldFilterModel").setProperty("/filters/" + sFieldName , oValue);
			
		},
		
		getValueByFieldNameFilterModel: function(controller, sFieldName)	{
			
			return controller.getView().getModel("oFieldFilterModel").getProperty("/filters/" + sFieldName);
			
		},
		
		addInFilterModel: function(controller, sFieldName, oValue)	{
			
			var aCurrFilters = controller.getView().getModel("oFieldFilterModel").getProperty("/filters/" + sFieldName);
			aCurrFilters.push(oValue);
			
			controller.getView().getModel("oFieldFilterModel").setProperty("/filters/" + sFieldName , aCurrFilters);
			
		},
		
		putInDateFilterModel: function(controller, sFieldName, oValue, sFromOrTo){
			
			var aDateFilters = this.getValueByFieldNameFilterModel(controller, sFieldName),
				oCurrFilter,
				flag = 0;
			
			for(var i = 0; i < aDateFilters.length; i++){
				oCurrFilter = aDateFilters[i];
				if(oCurrFilter.Operator === sFromOrTo){
					flag = 1;
					oCurrFilter.Value1 = oValue.Value1;
					this.putInFilterModel(controller, sFieldName, aDateFilters);
				}
			}
			if(flag === 0){
				aDateFilters.push(oValue);
				this.putInFilterModel(controller, sFieldName, aDateFilters);				
			}
				
			return;
			
		},
		
		_generateAllFilter: function(controller,Filter){
			
			var aFiltersName = controller.getView().getModel("oFieldFilterModel").getProperty("/filtersField"),
				allFilters = [];
				
				
				for(var i = 0; i < aFiltersName.length; i++){
					var singleFilter = this._generateORSingleFilter(controller, aFiltersName[i], Filter);
					if (singleFilter.length > 0){
						allFilters.push(singleFilter[0]);
					}
				}
				
				/**** MEMO 
				//Operation sostiture con la proprietà corretta quando verrà definito l'OData
				if(bAll){
					allFilters.push(new Filter("Operazione", "EQ", "ALL")); 
				}
				****/
				
				if(allFilters.length > 0){
					return new Filter(allFilters,true);
				}
				else{
					return [];
				}
			
		},
		
		_generateORSingleFilter: function(controller, sFieldName, Filter)	{
			
			var aSingleFilters = controller.getView().getModel("oFieldFilterModel").getProperty("/filters/" + sFieldName),
				aFilters = [],
				aOrFilter = [];
				
				//if(arrPath === "CID" && controller._){}
				
				for(var i = 0; i < aSingleFilters.length; i++){
					aFilters.push(new Filter(
									aSingleFilters[i].Path,
									aSingleFilters[i].Operator,
									aSingleFilters[i].Value1,
									aSingleFilters[i].Value2
									));
				}
			if(sFieldName !== 'CommitDate'){
				aOrFilter = aFilters.length > 0 ? [new Filter(aFilters,false)] : [];				
			}else{
				aOrFilter = aFilters.length > 0 ? [new Filter(aFilters,true)] : [];
			}
			
			
			return aOrFilter;
			
		},
		
		resetAllFilters: function(oController){
		
			var aAllFilterFields = this.getAllFitersFields(oController),
				sFieldName;
			
			for(var i = 0 ; i < aAllFilterFields.length ; i++){
				sFieldName = aAllFilterFields[i];
				this.refreshInFilterModel(oController, sFieldName);
			}
			
		},
		
		getAllFitersFields: function(oController){
			return oController.getView().getModel("oFieldFilterModel").getProperty("/filtersField");
		}
		
	};
});