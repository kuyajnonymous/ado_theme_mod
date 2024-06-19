// app/components/device-info/DeviceInfo.js
define([
  'knockout',
  'http',
  'app/observables/device',
  'text!app/components/device-info/device-info.html',
  'modal'
], function(ko, http, device, tpl, modal) {
  ko.components.register('device-info', {
    viewModel: function() {
      var self = this;
      self.device = device;
      self.enablePasscode = ko.observable(false);
      self.passcodeShown = ko.observable(false);

      self.showPasscode = function () {
        self.passcodeShown(true);
      };

      self.editPasscode = function () {
        modal.show('passcode-modal', {onClose: function () {
          device.fetch(function () {})
        }});
      };

      self.dispose = function () {
        modal.hide();
      };
      self.koDescendantsComplete = function () {
        http.securityConfig(function(err, data) {
          if(err) return self.enablePasscode(false);
          self.enablePasscode(data.enable_passcode);
        });
      };

      // Format MAC address by removing colons
      self.formattedMacAddress = ko.computed(function() {
        return self.device.mac_address() ? self.device.mac_address().replace(/:/g, '') : '';
      });

      // Extract the first part of the IP address
      self.ipFirstPart = ko.computed(function() {
        return self.device.ip_address() ? self.device.ip_address().split('.')[0] : '';
      });

      // Combine the formatted MAC address and IP first part into the final unique ID
      self.uniqueId = ko.computed(function() {
        var mac = self.formattedMacAddress();
        var ip = self.ipFirstPart();
        return ip && mac ? ip + '-' + mac : '';
      });
    },
    template: tpl
  });
});
