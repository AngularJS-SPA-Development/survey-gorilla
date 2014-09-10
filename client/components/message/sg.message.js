angular.module('sg.message').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('ko_KR', {"Login Fail":"로그인 실패","Login Success":"로그인 성공","Signup Fail":"사용자 등록 실패","Signup Success":"사용자 등록 성공","User Email Duplicated":"사용자 이메일 중복"});
/* jshint +W100 */
}]);