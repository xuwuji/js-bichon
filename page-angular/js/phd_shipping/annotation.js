/**
 * Created by qilu2 on 2015/4/2.
 */

(function(){

    angular.module('nous.annotation',[])
        .factory('Annotation',['$resource','annotationOptions', function($resource,annotationOptions){
            var Annotation = $resource(annotationOptions.service_base+ '/:id',{id:'@id'});

            return Annotation;
        }])
        .provider('annotationOptions', function(){
//            var annotation_service_base = '//sm-cloud-5795.phx-os1.stratus.dev.ebay.com/nousfeservice/annotation';
            var annotation_service_base = '//nous.corp.ebay.com/nousfeservice/annotation';
            var annotationAccess = {

//                add: ['qilu2','qilu2','yhou','diehu1','mehu','hailu','lisu1','binwu4','qiayang','dazhao','yagarwal','krkrishnamoorthy','jingma1','xgeng','zholi','wenliu2','wpang','ysong1','lisu1','shunjzhang','tonzhang','dazhao','yzhao5','liczhou','yanjzhou','vjalali','mjayaraman','arnarang','wpang','arramesh','bishao','zeqshen','yangzhou','clavergne','jiyang','palsingh','vegopalakris']
		  add: ['yeqli','qilu2','susaxena', 'vsrivastava', 'sugardella', 'asharma2', 'susaxena', 'chachiang', 'amahawar', 'yaoluo', 'srganta', 'mfainshtein', 'srganta', 'vkalluri', 'vinanarayan', 'vegopalakris', 'fwang1', 'yuemwang', 'wenlsong', 'roytai', 'vkatradimexi', 'anabhishek', 'zoili', 'lichzhou', 'qilu2', 'diehu1', 'shighuang', 'shuaili1', 'galiang', 'meixlin', 'hailu', 'qilu2', 'jipwang', 'qyang1', 'xgeng', 'yangjin', 'zholi', 'wenliu2', 'ysong1', 'lisu1', 'tonzhang', 'dazhao', 'yzhao5', 'vjalali', 'mjayaraman', 'wpang', 'arramesh', 'bishao', 'zeqshen', 'lirsun', 'mtsai', 'yangzhou']

            };
            this.setServiceBase = function(url){
                annotation_service_base = url;
            };
            this.setAccess = function(accessObj){
                annotationAccess = accessObj;
            };

            this.$get = function $annotationProviderFactory(){
                return {
                    service_base: annotation_service_base,
                    access: annotationAccess
                }
            }
        });


})();
