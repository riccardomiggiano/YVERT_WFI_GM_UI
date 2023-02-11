jQuery.sap.declare("it.template.util.Formatter");

/**
 * This is the main formatter for this application
 */
it.template.util.Formatter = {
	
	
		status: function(sam){
			if (sam === "A") {
        		return "sap-icon://message-success";
    		}else{
    			return "sap-icon://message-error";
    		}
		}
};