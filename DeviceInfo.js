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

      // Extract the first two characters of the IP address's first part
      self.ipFirstTwoChars = ko.computed(function() {
        return self.device.ip_address() ? self.device.ip_address().split('.')[0].substring(0, 2) : '';
      });

      // Get the MAC address excluding the first two characters
      self.macAddressWithoutFirstTwo = ko.computed(function() {
        var mac = self.formattedMacAddress();
        return mac.length > 2 ? mac.substring(2) : '';
      });

      // Combine the IP first two characters and the modified MAC address into the final unique ID
      self.uniqueId = ko.computed(function() {
        var ipFirstTwo = self.ipFirstTwoChars();
        var macRest = self.macAddressWithoutFirstTwo();
        return ipFirstTwo && macRest ? ipFirstTwo + macRest : '';
      });
    },
    template: tpl
  });
});
