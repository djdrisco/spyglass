var report = {
  
  // Non-parameterized reports
  
  vpcs: function(callback) {
    $.ajax({
      url: baseUrl + "/vpcs",
      success: function(data) {
        if (_.isFunction(console && console.log)) console.log('/vpcs', data);
        var data_table = _.flatten(_.map(data, function(region) {
          return _.map(region.Vpcs, function(vpc) {
            var tags = _.object(_.map(vpc.Tags, function(tag) {
              return [tag.Key, tag.Value];
            }));
            return [vpc.VpcId, tags, vpc.CidrBlock, region.Region];
          });
        }));
        data_table = _.sortBy(data_table, function(row) {return row[0]});
        data_table.unshift(['VPC ID', 'Tag(s)', 'CIDR Block', 'Region']);
        callback(null, '/VPCs', data_table);
      },
      dataType: "json"
    });        
  },
  
  external_ips: function(callback) {
    $.ajax({
      url: baseUrl + "/external_ips",
      success: function(data) {
        if (_.isFunction(console && console.log)) console.log('/external_ips', data);
        var data_table = _.flatten(_.map(data, function(region) {
          return _.map(region.Addresses, function(addr) {
            return [addr.PublicIp, addr.InstanceId, addr.PrivateIpAddress, addr.Domain, region.Region];
          });
        }));
        data_table.unshift(['Public IP', 'Inst. ID', 'Private IP', 'Domain', 'Region']);
        callback(null, '/External_IPs', data_table);
      },
      dataType: "json"
    });    
  },
  
  instances: function(callback) {
    $.ajax({
      url: baseUrl + "/instances",
      success: function(data) {
        if (_.isFunction(console && console.log)) console.log('/instances', data);
        var data_table = _.flatten(_.map(data, function(region) {
          return _.flatten(_.map(region.Reservations, function(resv) {return _.map(resv.Instances, function(inst) {
            var properties = {
              'Inst. ID': inst.InstanceId,
              'Private IP': inst.PrivateIpAddress,
              'Avail. Zone': inst.Placement.AvailabilityZone
            };
            var secgroups = _.map(inst.SecurityGroups, function(sgrp) {
              return new Linkable(sgrp.GroupId, sgrp.GroupName, 'security_group', [sgrp.GroupId])            
            });
            var tags = _.object(_.map(inst.Tags, function(tag) {
              return [tag.Key, tag.Value];
            }));
            var name = tags.Name;
            return [name, properties, secgroups, tags];
          });}));
        }));
        data_table = _.sortBy(data_table, function(row) {return row[0]});
        data_table.unshift(['Name', 'Properties', 'Security Group(s)', 'Tag(s)']);
        callback(null, '/Instances', data_table);
      },
      dataType: "json"
    });    
  },
  
  // Parameterized reports
  
  security_group: function(group_id, callback) {
    $.ajax({
      url: baseUrl + "/security_groups/" + group_id,
      success: function(data) {
        if (_.isFunction(console && console.log)) console.log('/security_groups/' + group_id, data);
        var data_table = _.flatten(_.map(data, function(region) {
          return _.map(region.SecurityGroups, function(secgrp) {
            var properties = {
              'Group ID': secgrp.GroupId,
              'Description': secgrp.Description
            };
            var permissions = new Table([
              ['col1', 'col2'],
              ['valA1', 'valA2'],
              ['valB1', 'valB2']
            ]);
            var tags = _.object(_.map(secgrp.Tags, function(tag) {
              return [tag.Key, tag.Value];
            }));
            return [secgrp.GroupName, properties, permissions, tags];
          });
        }));
        data_table.unshift(['Name', 'Properties', 'Permissions', 'Tag(s)']);
        callback(null, '/SecurityGroups/' + group_id, data_table);
      },
      dataType: "json"
    });
  }
  
};
