$(function() {
    
  $('#external_ips').click(function() {
    
    $("#results").text("");
    $("#results").append($("<img>").attr("src", baseUrl+"/img/loader.gif"));
    
    $.ajax({
      url: baseUrl + "/external_ips",
      success: function(data) {
        var result_table = _.flatten(_.map(data, function(region) {
          return _.map(region.Addresses, function(addr) {
            return [addr.PublicIp, addr.PrivateIpAddress, addr.Domain, region.Region]
          });
        }));
        result_table.unshift(['Public IP', 'Private IP', 'Domain', 'Region'])
        create_table(result_table);
      },
      dataType: "json"
    })
  });
  
});

function create_table(table_data) {

  var table = $("<table>").attr("class", "results");
  var tr = $("<tr>");
  _.each(_.first(table_data), function(field_name) {
    tr.append($("<th>").text(field_name));
  });
  table.append($("<thead>").append(tr));
  
  var tbody = $("<tbody>");

  _.each(_.rest(table_data), function(row) {
    var tr = $("<tr>");
    _.each(row, function(field) {
      tr.append($("<td>").text(field));
    });
    tbody.append(tr);
  });
  
  table.append(tbody);
  
  $("#results").text("");
  $("#results").append(table);
} 