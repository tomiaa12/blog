/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

/**
 * The URL query parameters.  One or more of the following:
 *
 *    args (gets split from comma-separated list to Array)
 *    gamepad
 *    icc_mcc
 *    icc_mnc
 *    icc_msisdn
 *    jad
 *    jars
 *    logConsole
 *    logLevel
 *    main
 *    midletClassName
 *    network_mcc
 *    network_mnc
 *    platform
 *    autosize
 *    fontSize
 *    language
 *    forceRuntimeCompilation
 *    deferStartup - Number of milliseconds to wait after loading JS sources and before starting the VM.
 *
 * Keep this list up-to-date!
 */

(function() {
  var params = {};

  // Robust query parsing:
  // - supports values containing ":" (e.g. http://...) without breaking
  // - supports values containing "="
  // - supports repeated params (e.g. ?jars=a&jars=b) by collecting into arrays
  var search = location.search || "";
  if (search.charAt(0) === "?") {
    search = search.substring(1);
  }

  if (typeof URLSearchParams !== "undefined") {
    var usp = new URLSearchParams(search);
    usp.forEach(function(value, key) {
      // Keep legacy behavior: treat "+" as space.
      value = value.replace(/\+/g, " ");
      if (params[key] === undefined) {
        params[key] = value;
      } else if (Array.isArray(params[key])) {
        params[key].push(value);
      } else {
        params[key] = [params[key], value];
      }
    });
  } else {
    // Fallback for very old browsers: split on "&" and only the first "=".
    search.split("&").forEach(function(pair) {
      if (!pair) return;
      var idx = pair.indexOf("=");
      var rawKey = idx === -1 ? pair : pair.substring(0, idx);
      var rawVal = idx === -1 ? "" : pair.substring(idx + 1);
      var key = decodeURIComponent(rawKey.replace(/\+/g, " "));
      var value = decodeURIComponent(rawVal.replace(/\+/g, " "));
      if (params[key] === undefined) {
        params[key] = value;
      } else if (Array.isArray(params[key])) {
        params[key].push(value);
      } else {
        params[key] = [params[key], value];
      }
    });
  }

  params.args = (params.args || "").split(",");

  if ("midletClassName" in params) {
    params.midletClassName = params.midletClassName.replace(/\//g, '.');
  }

  for (var name in params) {
    config[name] = params[name];
  }
})();
