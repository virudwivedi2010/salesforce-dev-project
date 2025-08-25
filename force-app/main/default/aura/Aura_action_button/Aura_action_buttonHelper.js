({
    helperMethod : function(component, event, helper, fromMethod) {
        var device = $A.get("$Browser.formFactor");
        var phoneFlag = $A.get("$Browser.isPhone");
        var iPhoneFlag = $A.get("$Browser.isIOS");
        var timestamp = new Date().getTime();
        var action = component.get("c.getCareARURL");
       /* if(device === "DESKTOP" ){
            helperFromMethod = fromMethod;
        } */
        
        action.setParams({ recordId : component.get("v.recordId"),
                          objectName : component.get("v.sObjectName"),
                          uniqueKey : timestamp,
                          phoneFlag : phoneFlag,
                          iphoneFlag: iPhoneFlag});
        action.setStorable(false);
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log('>>>>> state'+ state );
            if (state === "SUCCESS") {
                $A.get("e.force:refreshView").fire();
                console.log('>>>> response >>>> ' + response.getReturnValue());
                //component.set("v.currentCase", response.getReturnValue());
                var urlval = response.getReturnValue();
                console.log('urlval >>>>>**** ' + urlval);
                if(urlval === "true"){
                    //component.set("v.isFeedTrack", true);
                   // alert('One or more values of Config record are null, please check');
                }
                else{
                    //alert(window.location.href);
                    if(device === "DESKTOP" ){
                        if(urlval.includes('action=')){
                            window.open(urlval,'_blank',
                                       'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600')
                        }
                        else{
                       		urlval = response.getReturnValue()+'&callbackURL='+window.location.href; 
                            var urlEvent = $A.get("e.force:navigateToURL");
                        	urlEvent.setParams({
                            	"url": urlval
                        	});
                        	urlEvent.fire();
                        }
                        
                    }
                    else if(phoneFlag == true || iPhoneFlag == true){
                      urlval = response.getReturnValue();
                        var urlEvent = $A.get("e.force:navigateToURL");
                        urlEvent.setParams({
                            "url": urlval
                        });
                        urlEvent.fire();  
                    }
                    else{
                        urlval = response.getReturnValue()+'&callbackURL=salesforce1://sObject/'+component.get("v.recordId")+'/view';
							//alert(urlval);
                        var urlEvent = $A.get("e.force:navigateToURL");
                        urlEvent.setParams({
                            "url": urlval
                            //"url": response.getReturnValue()
                        });
                        urlEvent.fire();
                    }
                }
                
                $A.get("e.force:closeQuickAction").fire();              
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                var errorMessage = "Unknown error";
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        // log the error passed in to AuraHandledException
                        //console.log("Error message: " + errors[0].message);
                        errorMessage = errors[0].message;
                    }
                } 
                
                component.find('notifLib').showNotice({
                    "variant": "error",
                    "header": "Something has gone wrong!",
                    "message": errorMessage,
                    closeCallback: function() {
                        console.log(errorMessage);
                    }
                });
                $A.get("e.force:closeQuickAction").fire();
            }
        });
        $A.enqueueAction(action);
    }
})