angular.module('sg.message').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('ko_KR', {"Internal Server Error":"내부 서버 오류","Login Fail":"로그인 실패","Login Required. Or Your login info is expired.":"로그인이 필요합니다. 또는 계정이 만료되었습니다. ","Login Success":"로그인 성공","Not found the content.":"컨텐츠가 존재하지 않습니다.","Signup Fail":"사용자 등록 실패","Signup Success":"사용자 등록 성공","User Email Duplicated":"사용자 이메일 중복","You send a Bad Request. send the right thing.":"잘 못된 요청입니다. 올바른 요청을 보내세요.","Your Authorized is forbidden. Request the autorization to administrator.":"권한이 없습니다. 관리자에게 요청하세요."});
/* jshint +W100 */
}]);