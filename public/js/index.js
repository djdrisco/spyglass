$(function() {
    
  ////////////////////////////////////////////////////////////////////////////////////////
  // VPCs 
   
  $('#vpcs').click(function() {
    
    $("#results").text("");
    $("#results").append($("<img>").attr("src", baseUrl+"/img/loader.gif"));
    
    $.ajax({
      url: baseUrl + "/vpcs",
      success: function(data) {
        if (_.isFunction(console && console.log)) console.log('vpcs', data);
        var result_table = _.flatten(_.map(data, function(region) {
          return _.map(region.Vpcs, function(vpc) {
            var tags = _.object(_.map(vpc.Tags, function(tag) {
              return [tag.Key, tag.Value];
            }));
            return [vpc.VpcId, tags, vpc.CidrBlock, region.Region];
          });
        }));
        result_table = _.sortBy(result_table, function(row) {return row[0]});
        result_table.unshift(['VPC ID', 'Tag(s)', 'CIDR Block', 'Region']);
        create_table(result_table);
      },
      dataType: "json"
    });
  });
  
  ////////////////////////////////////////////////////////////////////////////////////////
  // External IPs 
   
  $('#external_ips').click(function() {
    
    $("#results").text("");
    $("#results").append($("<img>").attr("src", baseUrl+"/img/loader.gif"));
    
    $.ajax({
      url: baseUrl + "/external_ips",
      success: function(data) {
        if (_.isFunction(console && console.log)) console.log('external_ips', data);
        var result_table = _.flatten(_.map(data, function(region) {
          return _.map(region.Addresses, function(addr) {
            return [addr.PublicIp, addr.InstanceId, addr.PrivateIpAddress, addr.Domain, region.Region];
          });
        }));
        result_table.unshift(['Public IP', 'Inst. ID', 'Private IP', 'Domain', 'Region']);
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
        if (_.isFunction(console && console.log)) console.log('instances', data);
        var result_table = _.flatten(_.map(data, function(region) {
          return _.flatten(_.map(region.Reservations, function(resv) {return _.map(resv.Instances, function(inst) {
            var properties = {
              'Inst. ID': inst.InstanceId,
              'Private IP': inst.PrivateIpAddress,
              'Avail. Zone': inst.Placement.AvailabilityZone
            };
            var secgroups = _.map(inst.SecurityGroups, function(sgrp) {
              return new Linkable(sgrp.GroupId, sgrp.GroupName, baseUrl + '/security_groups/' + sgrp.GroupId);
            });
            var tags = _.object(_.map(inst.Tags, function(tag) {
              return [tag.Key, tag.Value];
            }));
            var name = tags.Name;
            return [name, properties, secgroups, tags];
          });}));
        }));
        result_table = _.sortBy(result_table, function(row) {return row[0]});
        result_table.unshift(['Name', 'Properties', 'Security Group(s)', 'Tag(s)']);
        create_table(result_table);
      },
      dataType: "json"
    });    
    
  });

  ////////////////////////////////////////////////////////////////////////////////////////
  
});


// Render 2D array table as HTML table in #results
function create_table(table_data) {

  var table = $('<table>').addClass('results');

  // header
  var tr = $('<tr>');
  _.each(_.first(table_data), function(field_name) {
    tr.append($('<th>').text(field_name));
  });
  table.append($('<thead>').append(tr));
  
  // body
  var tbody = $('<tbody>');
  _.each(_.rest(table_data), function(row) {
    var tr = $('<tr>');
    _.each(row, function(field) {
      var elem = render_value(field);
      tr.append($('<td>').append(elem));
    });
    tbody.append(tr);
  });
  
  table.append(tbody);
  table.data('data', table_data); // save data to table to apply post-transformations
  
  $("#results").text("");
  $("#results").append(table);
}

// Takes a heterogenous value and returns a jQuery element
function render_value(val) {
  if (val instanceof Linkable) {
    var link = $('<a>');
    link.data('id', val.id);
    link.text(val.display);
    link.attr('href', val.target);
    return link;
  } else if (_.isArray(val)) {
    if (val.length > 1) {
      var tbody = $('<tbody>');
      _.each(val, function(subval) {
        var trow = $('<tr>');
        trow.append($('<td>').append(render_value(subval)));
        tbody.append(trow);
      });
      return $('<table>').addClass('results').append(tbody);
    } else {
      return render_value(_.first(val));
    }
  } else if (_.isObject(val)) {
    var tbody = $('<tbody>');
    _.each(val, function(subval, subkey) {
      var trow = $('<tr>');
      trow.append($('<th>').html(subkey.replace(/\s/, '&nbsp;')));
      trow.append($('<td>').append(render_value(subval)));
      tbody.append(trow);
    });
    return $('<table>').addClass('results').addClass('keyval').append(tbody);        
  } else if (_.isString(val)) {
    return val;
  } else {
    return val;
  }
}

// Constructor of 'Linkable' type
function Linkable(id, display, target) {
  this.id = id;
  this.display = display;
  this.target = target;
  return this;
}
