(function() {
  var logParser,
      config = {};

  config = {
    $input: document.querySelector('.input-container .input'),
    $output: document.querySelector('.output-container .output'),
    $btnProcess: document.querySelector('.input-container .btn-process'),
    $btnInputClear: document.querySelector('.input-container .btn-clear'),
    $btnOutputClear: document.querySelector('.output-container .btn-clear'),
    $errors: document.querySelector('.input-container .error-messages'),
    successfulHttpCodes: [200],
    regexLog: /^([\d\.]*)\s([\w|-]*)\s([\w|-]*)\s\[(.*)\]\s\"([\w]*)\s(.*)\s(.*)\"\s([\d]*)\s([\d]*)$/
  };


  function LogParser(config) {
    this.config = config,
    this.successfulRequests = {};
    this.invalidLogEntryLines = [];

    this.attachEvents();
  }


  LogParser.prototype = {
    attachEvents: function() {
      var _this = this;

      this.config.$btnProcess.addEventListener('click', function() {
        _this.config.$output.value = '';
        _this.clearErrors();
        _this.processLog(_this.config.$input.value);
        _this.printOutput();
      });

      this.config.$btnInputClear.addEventListener('click', function() {
        _this.config.$input.value = '';
        _this.clearErrors();
      });

      this.config.$btnOutputClear.addEventListener('click', function() {
        _this.config.$output.value = '';
      });
    },

    processLog: function(log) {
      let lines = [];

      this.successfulRequests = {};
      lines = log.split('\n');

      for (let i = 0; i < lines.length; i++) {
        this.storeSuccessfulRequests(lines[i].match(this.config.regexLog), i + 1);
      }
    },

    storeSuccessfulRequests: function(matches, num) {
      if (matches !== null && matches.length > 0) {
        let ip = matches[1],
            httpCode = parseInt(matches[8], 10);

        if (!this.config.successfulHttpCodes.indexOf(httpCode)) {
          this.successfulRequests[ip] = (typeof this.successfulRequests[ip] === 'undefined') ? 1 : this.successfulRequests[ip] + 1;
        }
      } else {
        this.invalidLogEntryLines.push(num);
      }
    },

    printOutput: function() {
      let output = '',
          error = '',
          keys = Object.keys(this.successfulRequests).sort();

      for (key of keys) {
        output += key + '      ' + this.successfulRequests[key] + '\n';
      }

      this.config.$output.value = output;

      if (this.invalidLogEntryLines.length > 0) {
        error = 'ERROR : Invalid log format found at line number(s) - ' + this.invalidLogEntryLines.join(', ');
        this.config.$errors.innerHTML = error;
        this.config.$errors.style.display = 'inline';
      }
    },

    clearErrors: function() {
      this.config.$errors.innerHTML = '';
      this.config.$errors.style.display = 'none';
    }
  };



  logParser = new LogParser(config);


})();
