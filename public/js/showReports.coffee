validator = new Validator()

# ViewModel---------------------------------------------------------------
ShowReportsViewModel = ->
  self = @
  self.reports = ko.observableArray([])
  self.pageNum = ko.observableArray([1])
  self.currentPage = ko.observable(1)
  self.test = ko.observable(1)

  self

# 初始化 ---------------------------------------------------------------
init = ->

  reportvm = new ShowReportsViewModel()
  ko.applyBindings(reportvm)

  data = {page:1, pageNum:7}
  ReportModel.getReports(data, (response)->
    reportvm.reports(response.data))

  ReportModel.getReportNum((response)->
    pageNum = Math.ceil(response.data / 7 )
    reportvm.pageNum([1..pageNum]))

  $("#reportList").on("click", "p.delete", ->
    reportId = $(this).attr("reportId")
    ReportModel.deleteReport({reportId:reportId}, (response)->
      reports = reportvm.reports()
      for report in reports
        if report["id"] == reportId
          return reportvm.reports.remove(report)  ))

init()