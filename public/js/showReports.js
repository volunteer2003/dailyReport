// Generated by CoffeeScript 1.6.1
(function() {
  var confirm, deleteReport;

  getReports();

  getReportNum();

  confirm = function(reportId) {
    return $("#dialog-confirm").dialog({
      dialogClass: "no-close",
      resizable: false,
      height: 160,
      modal: true,
      buttons: {
        "Delete": function() {
          deleteReport(reportId);
          return $(this).dialog("close");
        },
        Cancel: function() {
          return $(this).dialog("close");
        }
      }
    });
  };

  $("#reportList").on("click", "p.delete", function() {
    var reportId;
    reportId = $(this).attr("reportId");
    return confirm(reportId);
  });

  deleteReport = function(reportId) {
    return ReportModel.deleteReport({
      reportId: reportId
    }, function(response) {
      var page;
      if (response.state === 0) {
        return;
      }
      reportvm.reportNum(reportvm.reportNum() - 1);
      page = reportvm.currentPage();
      if (reportvm.reports().length === 1 && reportvm.currentPage() > 1) {
        page = reportvm.currentPage() - 1;
      }
      return gotoPage(page);
    });
  };

}).call(this);
