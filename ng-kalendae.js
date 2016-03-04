// +----------------------------------------------------------------------
// | MTBI [ MorningTec ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.morningtec.cn/ All rights reserved.
// +----------------------------------------------------------------------
// | Author: Marvin9002 <448332799.qq.com> <http://www.liuyingwei.cn>
// +----------------------------------------------------------------------
/**
 *ng-kalendae
 */
var myApp = angular.module('ng-kalendae', []);
myApp.directive('ng-kalendae', function () {
    return {
        restrict: 'E',
        templateUrl: 'View/ng-kalendae.html',
        replace: true,
        scope: {
            months: '=months',
            mode: '=mode'
        },
        controller: ['$scope', '$element', function ($scope, $element) {
                var status1;
                var status2;
                var status3;
                var str = '';

                //  时间格式化
                function formatDate(date, format) {
                    if (!date)
                        return;
                    if (!format)
                        format = "yyyy-MM-dd";
                    switch (typeof date) {
                        case "string":
                            date = new Date(date.replace(/-/, "/"));
                            break;
                        case "number":
                            date = new Date(date);
                            break;
                    }
                    if (!date instanceof Date)
                        return;
                    var dict = {
                        "yyyy": date.getFullYear(),
                        "M": date.getMonth() + 1,
                        "d": date.getDate(),
                        "H": date.getHours(),
                        "m": date.getMinutes(),
                        "s": date.getSeconds(),
                        "MM": ("" + (date.getMonth() + 101)).substr(1),
                        "dd": ("" + (date.getDate() + 100)).substr(1),
                        "HH": ("" + (date.getHours() + 100)).substr(1),
                        "mm": ("" + (date.getMinutes() + 100)).substr(1),
                        "ss": ("" + (date.getSeconds() + 100)).substr(1)
                    };
                    return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
                        return dict[arguments[0]];
                    });
                }
                var currTime = new Date();
                currTime = new Date(currTime.setDate(currTime.getDate() - 1));
                var currentTime = currTime.getFullYear() + "-" + (parseInt(currTime.getMonth()) + 1) + "-" + currTime.getDate();
                var currDate = new Date();
                var preDate = new Date(currDate.setDate(currDate.getDate() - 14));
                var previousTime = preDate.getFullYear() + "-" + (parseInt(preDate.getMonth()) + 1) + "-" + preDate.getDate();
                var startSelectD = angular.element(document.querySelector('#startSelect'));
                var endSelectD = angular.element(document.querySelector('#endSelect'));
                var selectMenu = angular.element(document.querySelector('#selectedMenu'));
                $scope.isHide1 = false;
                $scope.isHide2 = false;
                previousTime = formatDate('"' + previousTime + '"', "yyyy-MM-dd");
                currentTime = formatDate('"' + currentTime + '"', "yyyy-MM-dd");
                $scope.startTime = previousTime;
                $scope.$watch('mode', function (newval, oldval) {
                    if (newval !== oldval) {
                        buildDate();
                    }
                });
                //重置时间
                $scope.$on('daterset', function (event, data) {
                    $scope.sta2 = $scope.mode == 1 || $scope.mode == 2 ? true : false;
                    $scope.sta1 = true;
                    $scope.sta3 = true;
                    
                    buildDate();
                });
                buildDate();
                function buildDate() {
                    currDate = new Date();
                    preDate = new Date(currDate.setDate(currDate.getDate() - 14));
                    previousTime = preDate.getFullYear() + "-" + (parseInt(preDate.getMonth()) + 1) + "-" + preDate.getDate();
                    previousTime = formatDate('"' + previousTime + '"', "yyyy-MM-dd");
                    currentTime = formatDate('"' + currentTime + '"', "yyyy-MM-dd");
                    $scope.startTime = previousTime;
                    $scope.endTime = "至" + currentTime;
                    //日期快捷方式
                    $scope.quickTime = false;
                    if ($scope.mode == 1) {//1-单选，2-多选，3－区间选，4-周选，5-月选
                        str = 'single';
                        $scope.startTime = currentTime;
                        $scope.endTime = "";
                        $scope.isHide2 = true;
                    } else if ($scope.mode == 2) {
                        str = 'multiple';
                        $scope.startTime = currentTime;
                        $scope.endTime = "";
                        $scope.isHide1 = true;
                        $scope.isHide2 = true;
                    } else if ($scope.mode == 3) {
                        str = 'range';
                        $scope.endTime = "至" + currentTime;
                        $scope.quickTime = true;
                        $scope.isHide1 = false;
                        $scope.isHide2 = false;
                        $scope.sta2 = $scope.mode == 1 || $scope.mode == 2 ? true : false;
                        $scope.sta1 = true;
                        $scope.sta3 = true;
                    } else if ($scope.mode == 4) {
                        str = 'week';
                        $scope.endTime = "至" + currentTime;
                        $scope.isHide1 = false;
                        $scope.isHide2 = false;
                        $scope.sta2 = $scope.mode == 1 || $scope.mode == 2 ? true : false;
                        $scope.sta1 = true;
                        $scope.sta3 = true;
                    } else if ($scope.mode == 5) {
                        str = 'month';
                        $scope.endTime = "至" + currentTime;
                        $scope.isHide1 = false;
                        $scope.isHide2 = false;
                        $scope.sta2 = $scope.mode == 1 || $scope.mode == 2 ? true : false;
                        $scope.sta1 = true;
                        $scope.sta3 = true;
                    }
                    $element = new Kalendae(document.getElementById("ng-kalendae"), {
                        months: $scope.months,
                        mode: str,
                        direction: 'past'
                    });
                }
                var len = "width:" + parseInt(parseInt($scope.months) * 270 + 20) + "px";
                selectMenu.attr("style", len);
                var bottomStartTime = $scope.mode > 2 ? "" : currentTime;
                startSelectD.text(bottomStartTime);
                $scope.confirmDate = function () {
                    if (startSelectD.text() != $scope.startTime || ("至" + endSelectD.text()) != $scope.endTime) {
                        $scope.sta1 = true;
                        $scope.sta2 = true;
                        $scope.sta3 = true;
                    } else {
                        $scope.sta1 = status1;
                        $scope.sta2 = status2;
                        $scope.sta3 = status3;
                    }
                    if (startSelectD.text()) {
                        $scope.startTime = startSelectD.text();
                    } else {
                        $scope.startTime = currentTime;
                    }
                    if ($scope.mode != 1 || $scope.mode != 2) {
                        $scope.endTime = "至" + endSelectD.text();
                    } else {
                        $scope.endTime = "";
                    }
                    if (!endSelectD.text()) {
                        $scope.endTime = "";
                    }
                    $scope.isHide = true;
                    var dateList = [];
                    if (endSelectD.text() != "") {
                        dateList.push(startSelectD.text());
                        if (startSelectD.text() != endSelectD.text())
                            dateList.push(endSelectD.text());
                    }
                    var message = null;
                    if (dateList.length > 0) {
                        message = dateList;
                    } else {
                        message = $scope.startTime + $scope.endTime;
                    }
                    $scope.$emit("region", message);
                }
                $scope.cancelSelect = function () {
                    $scope.isHide = true;
                }
                $scope.sta2 = $scope.mode == 1 || $scope.mode == 2 ? true : false;
                $scope.sta1 = true;
                $scope.sta3 = true;
                status1 = $scope.sta1;
                status2 = $scope.sta2;
                status3 = $scope.sta3;
                $scope.onClick = function (num) {
                    currDate = new Date();
                    if (num == 1) {
                        $scope.sta1 = false;
                        $scope.sta2 = true;
                        $scope.sta3 = true;
                        preDate = new Date(currDate.setDate(currDate.getDate() - 7));
                    } else if (num == 2) {
                        $scope.sta1 = true;
                        $scope.sta2 = false;
                        $scope.sta3 = true;
                        preDate = new Date(currDate.setDate(currDate.getDate() - 14));
                    } else {
                        $scope.sta1 = true;
                        $scope.sta2 = true;
                        $scope.sta3 = false;
                        preDate = new Date(currDate.setDate(currDate.getDate() - 30));
                    }
                    status1 = $scope.sta1;
                    status2 = $scope.sta2;
                    status3 = $scope.sta3;
                    previousTime = preDate.getFullYear() + "-" + (parseInt(preDate.getMonth()) + 1) + "-" + preDate.getDate();
                    previousTime = formatDate('"' + previousTime + '"', "yyyy-MM-dd");
                    $scope.startTime = previousTime;
                    $scope.endTime = "至" + currentTime;
                    startSelectD.text(previousTime);
                    endSelectD.text(currentTime);
                    var dateList = [];
                    dateList.push(previousTime);
                    dateList.push(currentTime);
                    var message = dateList;
                    $scope.$emit("region", message);
                    currDate = new Date();
                }
                $scope.isHide = true;
                $scope.showDate = function () {
                    $scope.isHide = !$scope.isHide;
                    if (!$scope.isHide) {
                        $scope.sta1 = true;
                        $scope.sta2 = true;
                        $scope.sta3 = true;
                    } else {
                        $scope.sta1 = status1;
                        $scope.sta2 = status2;
                        $scope.sta3 = status3;
                    }
                }
                $scope.comeBack = function () {
                    $scope.isHide = true;
                }
            }]
    }
});




			