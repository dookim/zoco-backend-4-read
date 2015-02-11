var sprintf = require('sprintf').sprintf;

exports.getUnixTimestamp = function() {
  return String(Math.round(Date.now() / 1000));
};

// @param {Object} info(year, month, date, hours, min, sec)
exports.convertTimestampToDate = function(unixTime) {
  var MONTH = [1,2,3,4,5,6,7,8,9,10,11,12];
  var date = {};
  var DT = new Date(unixTime * 1000);
  date.year = DT.getFullYear();
  date.month = MONTH[DT.getMonth()];
  date.date = DT.getDate();
  date.hours = DT.getHours();
  date.min = DT.getMinutes();
  date.sec = DT.getSeconds();
  return date;
};


// TODO: if month and year difference 
exports.setDateDifferenceFromLastLogin = function(last_login, now) {
  var login_date = this.convertTimestampToDate(last_login);
  var now_date = this.convertTimestampToDate(now);
  // today 
  if (login_date.year >= now_date.year && login_date.month >= now_date.month && login_date.date >= now_date.date) {
    return "0";
  }
  return String(now_date.date - login_date.date);
};



//** 정해진 날자에 일정 날자를 빼거나 더할때 
exports.add_date = function (data) { // 매서드가 될 함수 구현
   var currentDate; // 계산된 날
   currentDate = this.getDate() + data *1; // 현재 날짜에 더해(빼)줄 날짜를 계산
   return this.setDate(currentDate);       // 계산된 날짜로 다시 세팅
}
 


// Convert Unixtimestamp to yyyyMMdd
exports.convertTimestampToNumberDate = function (timestamp) {
  var date = null;
  if (timestamp == null) {
    date = new Date(Date.now());
  } else {
    date = new Date(timestamp * 1000);
  }
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  // format yyyy:MM:dd
  var ret = sprintf('%d%02d%02d', year, month, day);
  return ret;
};

// 날짜를 요일로
exports.convertTimestampToWeek = function(timestamp) {
  var date = new Date(timestamp * 1000);
  var week = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return (week[date.getDay()]);
};
