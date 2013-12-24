// Generated by CoffeeScript 1.6.1
(function() {
  var WriteReportViewModel, editor, init, validator;

  validator = new Validator();

  // this 'content' should be assign to this week's report or report template if the report not exists
  editor = UE.getEditor('content');

  WriteReportViewModel = function() {
    var self;
    self = this;
    self.dateTxt = ko.observable(null);
    self.validDateTxt = ko.computed(function() {
      var date, dateStr, months, year, _ref;
      dateStr = $.trim(self.dateTxt());
      try {
        validator.check(dateStr).notEmpty();
        _ref = dateStr.split("-"), year = _ref[0], months = _ref[1], date = _ref[2];
        validator.check(year).notNull().isNumeric().len(4, 4);
        validator.check(months).notNull().isNumeric().len(1, 2);
        //validator.check(date).notNull().isNumeric().len(1, 2);
        return true;
      } catch (error) {
        return false;
      }
    });
    return self;
  };

  init = function() {
    var dateStr, getDateStr, reportvm;
	$("#dateTxt").datepicker();//enable the calendar when click in the input box
    $("#dateTxt").datepicker("option", "dateFormat", "yy-mm-dd to yy-mm-dd");
    reportvm = new WriteReportViewModel();
    ko.applyBindings(reportvm);
    getDateStr = function(date) {
      var month, today, year, day;
	  var month_first, day_first, year_first; // for calc the first day and the last day of the week
	  var month_last, day_last, year_last;
	  
	  date = new Date();
      day = new Date();
	  day_new = new Date();
      year = date.getFullYear();
      month = date.getMonth() + 1;
	  day = date.getDate();
      
	  //return "" + year + "-" + month + "-" + day;
	  
	  // calc the first day of the week
	  day_new.setDate(date.getDate() - date.getDay() + 1);
	  year_first = day_new.getFullYear();
      month_first = day_new.getMonth() + 1;
	  day_first = day_new.getDate();
	  //return "" + year_first + "-" + month_first + "-" + day_first;
	  
	  // calc the last day of the week
	  day_new.setDate(day_new.getDate() + 6);
	  year_last = day_new.getFullYear();
      month_last = day_new.getMonth() + 1;
	  day_last = day_new.getDate();
	  //return "" + year_last + "-" + month_last + "-" + day_last;
	  
	  return "" + year_first + "-" + month_first + "-" + day_first + " to " + year_last + "-" + month_last + "-" + day_last;
	   
    };
    dateStr = getDateStr(new Date());
	console.log('Got the report date:[' + dateStr +']');
    reportvm.dateTxt(dateStr);

    return $("#reportSubmitBtn").click(function(event) {
      var data;
      if (!reportvm.validDateTxt()) {
        return;
      }
      dateStr = getDateStr($("#dateTxt").datepicker());
      data = {
        date: dateStr,
        content: editor.getContent()
      };
	  console.log('Got the report content:[' + editor.getContent() +']');
      return ReportModel.createReport(data, function(response) {
        if (response.state === 0) {
          return;
        }
        return window.location.href = "/show";
      });
    });
  };

  init();

}).call(this);
