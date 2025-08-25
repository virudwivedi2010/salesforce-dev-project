public class carear_cc_action_button {
     @AuraEnabled(cacheable=true)
    public static String getCareARURL(String recordId, String objectName, String uniqueKey, boolean phoneFlag, boolean iphoneFlag) {
        

        try {
            
             String urlData;
            
            urlData = 'https://www.youtube.com/';
    
            return urlData;

        } catch (Exception e) {
            System.debug('Error: ' + e.getMessage());
            return null;
        }
    }

}