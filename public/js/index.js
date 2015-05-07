$(function() {
    
  ////////////////////////////////////////////////////////////////////////////////////////
  // External IPs 
   
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
    });
  });
  
  ////////////////////////////////////////////////////////////////////////////////////////
  // Instances
  
  $('#instances').click(function() {
    
    $("#results").text("");
    $("#results").append($("<img>").attr("src", baseUrl+"/img/loader.gif"));
    
    $.ajax({
      url: baseUrl + "/instances",
      success: function(data) {
        console.log(data);
        var result_table = _.flatten(_.map(data, function(region) {
          return _.flatten(_.map(region.Reservations, function(resv) {return _.map(resv.Instances, function(inst) {
            var secgroups = _.pluck(inst.SecurityGroups, 'GroupName');
            var tags = _.object(_.map(inst.Tags, function(tag) {
              return [tag.Key, tag.Value];
            }));
            var name = tags.Name;
            return [name, inst.PrivateIpAddress, secgroups, tags, region.Region];
          });}));
        }));
        result_table = _.sortBy(result_table, function(row) {return row[0]});
        result_table.unshift(['Name', 'Private IP', 'Security Groups', 'Tags', 'Region'])
        create_table(result_table);
      },
      dataType: "json"
    });    
    
  });

  ////////////////////////////////////////////////////////////////////////////////////////
  
});

function create_table(table_data) {

  var table = $('<table>').attr('class', 'results');
  var tr = $('<tr>');
  _.each(_.first(table_data), function(field_name) {
    tr.append($('<th>').text(field_name));
  });
  table.append($('<thead>').append(tr));
  
  var tbody = $('<tbody>');

  _.each(_.rest(table_data), function(row) {
    var tr = $('<tr>');
    _.each(row, function(field) {
      if (_.isArray(field)) {
        var tbody = $('<tbody>');
        _.each(field, function(val) {
          var trow = $('<tr>');
          trow.append($('<td>').text(val));
          tbody.append(trow);
        });
        tr.append($('<td>').append($('<table>').append(tbody)));     
      } else if (_.isObject(field)) {
        var tbody = $('<tbody>');
        _.each(field, function(val, key) {
          var trow = $('<tr>');
          trow.append($('<th>').text(key));
          trow.append($('<td>').text(val));
          tbody.append(trow);
        });
        tr.append($('<td>').append($('<table>').append(tbody)));        
      } else {
        tr.append($('<td>').text(field));        
      }
    });
    tbody.append(tr);
  });
  
  table.append(tbody);
  
  $("#results").text("");
  $("#results").append(table);
} 