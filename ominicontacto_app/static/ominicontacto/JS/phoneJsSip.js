//***************************************************
//2001, 2002 (123456)
var lastDialedNumber, config, textSipStatus, callSipStatus, iconStatus, userAgent, sesion, opciones, eventHandlers, flagHold = true, flagTransf = false,flagInit = true, num = null, headerIdCamp, headerNomCamp, calltypeId, flagPausa = false;
var sipStatus = document.getElementById('SipStatus');var callStatus = document.getElementById('CallStatus');var local = document.getElementById('localAudio');var remoto = document.getElementById('remoteAudio');var displayNumber = document.getElementById("numberToCall"); var pauseButton = document.getElementById("Pause");
var KamailioIp = "172.16.20.14";
$(function() {
	$("#redial").prop('disabled', true);
	$('#modalSelectCmp').modal('hide');
  var estado = JSON.stringify({'status' : 'online'});
  /*$.ajax({
    url: '/status/setStat',
    type: 'POST',
    contentType: 'application/json',
    data: estado,
    succes: function (msg) {
        console.log(JSON.parse(msg));
    },
    error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error al ejecutar => " + textStatus + " - " + errorThrown);
    }
  });*/
 
  $("#Pause").click(function () {
    if (flagPausa === true) {
    num = "0077UNPAUSE";
    makeCall();
    flagPausa = false;
    } else {
    	flagPausa = true;
    }
  });
  
  if($("#sipExt").val() && $("#sipSec").val()) {
    config = {
      uri : "sip:"+$("#sipExt").val()+"@"+KamailioIp,
      ws_servers : "wss://"+KamailioIp+":443",
      password : $("#sipSec").val(),
      session_timers: false//"123456"
    };
    userAgent = new JsSIP.UA(config);
    sesion = userAgent.start();
  }
  
  $("#sipLogout").click(function() {
    num = "0077LOGOUT";
    makeCall();
    userAgent.unregister();
  });
  
  $("#CallList").click(function() {
    $("#modalCallList").modal('show');
  });
  
  $("#setPause").click(function() {    
    flagPausa = true;
    num = "0077"+$("#pauseType").val().toUpperCase();
    makeCall();
  });

  $(".key").click(function(e) {
    var numPress = "";
    if(displayNumber.value === "") {
      numPress = e.currentTarget.childNodes[0].data;
    } else {
      numPress = displayNumber.value;
      numPress += e.currentTarget.childNodes[0].data;
    }
    displayNumber.value = numPress;
  });
  
  $("#unregister").click(function() {
    userAgent.unregister();
    
    userAgent.on('unregistered', function(e) {
      setSipStatus("reddot.png", "  Unregistered", sipStatus);
    });
  });
  
  $("#unregister").prop('disabled', false);
    //Connects to the WebSocket server
    userAgent.on('registered', function(e) {
  	setSipStatus("greydot.png", "  No account", sipStatus);
  	$("#UserStatus").html("Online");
    num = "0077LOGIN";
    makeCall();
    $("#sendMessage").prop('disabled', false);
    $("#chatMessage").prop('disabled', false);
    iconStatus.parentNode.removeChild(iconStatus);
    textSipStatus.parentNode.removeChild(textSipStatus);
    setSipStatus("greendot.png", "  Registered", sipStatus);
    defaultCallState();
  });

  userAgent.on('registrationFailed', function(e) {
    setSipStatus("redcross.png", "  Registration failed", sipStatus);
  });

  userAgent.on('newRTCSession', function(e) {
	  var originHeader = "";
    e.session.on('ended',function() {
      parar3();
      defaultCallState();
      if($("#auto_pause").val() === "True" && originHeader !== "") {
        num = "0077ACW";
    		makeCall();
    		entrante = false;    			
    		// cod que se repite en main.js.. se deberia mejorar esto
    		pauseButton.className = "btn btn-danger";
	      pauseButton.innerHTML = "Resume";
	      modifyUserStat = document.getElementById("UserStatus");
	      modifyUserStat.className = "label label-warning";
	      modifyUserStat.innerHTML = "ACW";
	      flagPausa = true;
	      parar1();
	      inicio2();
	      //reinicio($("#horaC"), $("#minsC"), $("#segsC")); 
      } else if (num.substring(4,0) != "0077") {
				var callerOrCalled = "";       	
      	if(entrante) {
      		callerOrCalled = fromUser;
      	} else {
      		callerOrCalled =  num;
      	}
      	console.log($("#horaC").val()+":"+$("#minsC").val() +":"+ $("#segsC").val());
        $.ajax({
          type: "get",
	   	    url: "/duracion/llamada/",
	   	    contentType: "text/html",
	   	    data : "duracion="+$("#horaC").val()+":"+$("#minsC").val() +":"+ $("#segsC").val()+"&agente="+$("#idagt").val()+"&numero_telefono="+callerOrCalled+"&tipo_llamada="+calltypeId,
	   	    success: function (msg) {
	   	 	    reinicio($("#horaC"), $("#minsC"), $("#segsC"));
	   	    },
	   	    error: function (jqXHR, textStatus, errorThrown) {
	          debugger;
	          console.log("Error al ejecutar => " + textStatus + " - " + errorThrown);
	        } 
        });
        
      }
    });
      
    function reinicio(horaDOM, minDOM, segDOM) {
	    clearInterval(control);
	    centesimasP = 0;
	    segundosP = 0;
	    minutosP = 0;
	    segDOM.html(":00");
	    minDOM.html(":00");
	    horaDOM.html("00");
  	}
    //dar solucion a la repeticion de codigo, esto ya existe en main.js
    function parar1() {
	    clearInterval(control1);
	 	}
	 	function parar3() {
	    clearInterval(control3);
	 	}
	 	function inicio2() {
	    control2 = setInterval(cronometro2, 1000);
	 	}
	 	function inicio3() {
	 		control3 = setInterval(cronometro3, 1000);
	 	}
    function cronometro2() {
	    if (centesimasP < 59) {
	      centesimasP++;
	        if (centesimasP < 10) {
	          centesimasP = "0" + centesimasP;
	        }
	        $("#segsP").html(":" + centesimasP);
	    }
	    if (centesimasP == 59) {
	      centesimasP = -1;
	    }
	    if (centesimasP == 0) {
	      segundosP++;
	        if (segundosP < 10) {
	          segundosP = "0" + segundosP;
	        }
	        $("#minsP").html(":" + segundosP);
	    }
	    if (segundosP == 59) {
	      segundosP = -1;
	    }
	    if ((centesimasP == 0) && (segundosP == 0)) {
	      minutosP++;
	        if (minutosP < 10) {
	          minutosP = "0" + minutosP;
	        }
	        $("#horaP").html("" + minutosP);
	    }
	  }
	 //****************************CRONOMETRO DE LLAMADA***********************************
	 function cronometro3() {
	     if (centesimasC < 59) {
	         centesimasC++;
	         if (centesimasC < 10) {
	             centesimasC = "0" + centesimasC;
	         }
	         $("#segsC").html(":" + centesimasC);
	     }
	     if (centesimasC == 59) {
	         centesimasC = -1;
	     }
	     if (centesimasC == 0) {
	         segundosC++;
	         if (segundosC < 10) {
	             segundosC = "0" + segundosC;
	         }
	         $("#minsC").html(":" + segundosC);
	     }
	     if (segundosC == 59) {
	         segundosC = -1;
	     }
	     if ((centesimasC == 0) && (segundosC == 0)) {
	         minutosC++;
	         if (minutosC < 10) {
	             minutosC = "0" + minutosC;
	         }
	         $("#horaC").html("" + minutosC);
	     }
	 }
	 		//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      e.session.on('failed',function(e) {
        $("#aTransfer").prop('disabled', true);
        $("#bTransfer").prop('disabled', true);
        $("#onHold").prop('disabled', true);
        $("#modalReceiveCalls").modal('hide');
        Sounds("","stop");
      });
      if(e.originator=="remote") {
      	entrante = true;
      	if(e.request.headers.Origin) {
      	  originHeader = e.request.headers.Origin[0].raw;
      	  
      	}
      	if (e.request.headers.Idcliente) {
      		var leadIdHeader = e.request.headers.Idcliente[0].raw;
      	}
      	if (e.request.headers.Idcamp) {
      		var CampIdHeader = e.request.headers.Idcamp[0].raw;
      	}
        var fromUser = e.request.headers.From[0].raw;
        var endPos = fromUser.indexOf("@");
        var startPos = fromUser.indexOf(":");
        fromUser = fromUser.substring(startPos+1,endPos);

        if(CampIdHeader) {
        	if(leadIdHeader) {
        		getData(CampIdHeader, leadIdHeader, $("#idagt").val());
        	} else {
        		if(fromUser !== "Unknown") {
        	    processCallid(fromUser);
        		} else {
        			getBlankFormCamp(CampIdHeader);
        		}
        	}
        } else {
          alert("Problemas con Identificador de Campaña");
        }
        $("#callerid").text(fromUser);
        if($("#modalWebCall").is(':visible')) {
          $("#modalReceiveCalls").modal('show');
        } else {
          $("#modalWebCall").modal('show');
          $("#modalReceiveCalls").modal('show');
        }
        Sounds("In", "play");
        var atiendoSi = document.getElementById('answer');
        var atiendoNo = document.getElementById('doNotAnswer');
        var session_incoming = e.session;
        
        session_incoming.on('addstream',function(e) {
          remote_stream = e.stream;
          remoto = JsSIP.rtcninja.attachMediaStream(remoto, remote_stream);
        });
        
        var options = {'mediaConstraints': {'audio': true,'video': false}};
        calltypeId = originToId(originHeader);
        processOrigin(originHeader, options);
        
        atiendoSi.onclick = function() {
          $("#modalReceiveCalls").modal('hide');
          session_incoming.answer(options);
          setCallState("Connected", "orange");
          Sounds("","stop");
        };
        
        atiendoNo.onclick = function() {
          $("#modalReceiveCalls").modal('hide');
          if($("#autopause").val() === "True") {
          	
          }
          userAgent.terminateSessions();
          defaultCallState();
        };
        function originToId(origin) {
        	var id = '';
        	switch(origin) {
  					case "DIALER":
  						id = 2;
  		  			break;
  					case "IN":
  		  			id = 3;
  		  			break;
			  		case "ICS":
  						id = 1;
  						break;
 						default:
  						id = 4;
  						break;
  				}
  				return id;
        }
        function processOrigin(origin, opt) {
			  	var options = opt;
  				switch(origin) {
  					case "DIALER":
  						var dialerTag = document.getElementById("auto_attend_DIALER");
  						if(dialerTag.value === "True") {
  							$("#modalReceiveCalls").modal('hide');
  			  			session_incoming.answer(options);
          			setCallState("Connected", "orange");
          			Sounds("","stop");
  						}
  		  			break;
  					case "IN":
  		  			var inboundTag = document.getElementById("auto_attend_IN");
  		  			if(inboundTag.value === "True") {
  		  				$("#modalReceiveCalls").modal('hide');
  			  			session_incoming.answer(options);
          			setCallState("Connected", "orange");
          			Sounds("","stop");
  						}
  		  			break;
			  		case "ICS":
  						var icsTag = document.getElementById("auto_attend_ICS");
  						if(icsTag.value === "True") {
			  				$("#modalReceiveCalls").modal('hide');
  			  			session_incoming.answer(options);
          			setCallState("Connected", "orange");
          			Sounds("","stop");
  						}	
  		  			break;  
  				}
  			}
  			
      } else {
      	calltypeId = originToId(null);
        Sounds("Out", "play");
        var session_outgoing = e.session;

      }
      
      e.session.on("accepted", function() {
        Sounds("", "stop");
        $("#aTransfer").prop('disabled', false);
        $("#bTransfer").prop('disabled', false);
        $("#onHold").prop('disabled', false);
        inicio3();
      });
      
  		  var clickHold = document.getElementById("onHold");
  		  clickHold.onclick = function () {
  		  	if(flagHold) {
  		  		flagHold = false;
  		  	  e.session.hold();
  		  	} else {
  		  	  flagHold = true;
  		  	  e.session.unhold();  		  	
  		  	}
  		  };
        var aTransf = document.getElementById("aTransfer");
        aTransf.onclick = function() {
          flagTransf = true;
          e.session.sendDTMF("*");
          e.session.sendDTMF("2");
          setTimeout(transferir(e), 3000);
        };
        var bTransf = document.getElementById("bTransfer");
        bTransf.onclick = function() {
          flagTransf = true;
          e.session.sendDTMF("#");
          e.session.sendDTMF("#");
          setTimeout(transferir(e), 3000);
        };
        
        function transferir(objRTCsession) {
          objRTCsession.session.sendDTMF(displayNumber.value);
        }
    });
    
  $("#redial").click(function () {  	
  	entrante = false;
  	num = lastDialedNumber;
  	$("#modalSelectCmp").modal("show");
    // esto es para enviar un Invite/llamada
  });
  
  $("#endCall").click(function() {
    Sounds("", "stop");
    userAgent.terminateSessions();
    defaultCallState();
  });
  
  $("#call").click(function(e) {
  	entrante = false;
  	$("#modalSelectCmp").modal("show");
    // esto es para enviar un Invite/llamada
    num = displayNumber.value;
    lastDialedNumber = num;
    });
    
    $("#SelectCamp").click(function () {
    	$("#modalSelectCmp").modal("hide");
    	headerIdCamp = $("#cmpList").val();
    	headerNomCamp = $("#cmpList option:selected").html();
      $("#redial").prop('disabled',false);
    	makeCall();
  });
  
  function makeCall() {
    eventHandlers = {
      'confirmed':  function(e) {
        // Attach local stream to selfView
                    local.src = window.URL.createObjectURL(sesion.connection.getLocalStreams()[0]);
                    },
      'addstream':  function(e) {
                    setCallState("Connected", "orange");
                    var stream = e.stream;
                    // Attach remote stream to remoteView
                    remoto.src = window.URL.createObjectURL(stream);
                    },
      'failed': function(data) {
                  if (data.cause === JsSIP.C.causes.BUSY) {
                    Sounds("", "stop");
      					  	Sounds("", "play");
                  	setCallState("Ocupado, intenta mas tarde", "orange");
                   	setTimeout(defaultCallState, 5000);
                  } else if (data.cause === JsSIP.C.causes.REJECTED) {
                    setCallState("Rechazo, intenta mas tarde", "orange");
                    setTimeout(defaultCallState, 5000);
                  } else if (data.cause === JsSIP.C.causes.UNAVAILABLE) {
                      setCallState("Unavailable", "red");
                      setTimeout(defaultCallState, 5000);
                  } else if (data.cause === JsSIP.C.causes.NOT_FOUND) {
                    setCallState("Error, revisa el numero discado", "red");
                    setTimeout(defaultCallState, 5000);
                  } else if (data.cause === JsSIP.C.causes.AUTHENTICATION_ERROR) {
                    setCallState("Auth error", "red");
                    setTimeout(defaultCallState, 5000);
                  } else if (data.cause === JsSIP.C.causes.MISSING_SDP) {
                    setCallState("Missing sdp", "red");
                    setTimeout(defaultCallState, 5000);
                  } else if (data.cause === JsSIP.C.causes.ADDRESS_INCOMPLETE) {
                    setCallState("Address incomplete", "red");
                    setTimeout(defaultCallState, 5000);
                  } else if (data.cause === "SIP Failure Code") {
      							  setCallState("JsSIP SIP Failure code (500)", "red");
                    	setTimeout(defaultCallState, 5000);
                  }
                }
    };
    opciones = {
      'eventHandlers': eventHandlers,
      'mediaConstraints': {
                'audio': true,
                'video': false
              },
      'extraHeaders':['Idcamp:'+headerIdCamp, 'Nomcamp:'+headerNomCamp] 
    };
    //Mando el invite/llamada
     if(flagInit === true) {
       flagInit = false;
       sesion = userAgent.call("sip:"+num+"@"+KamailioIp, opciones);
     } else {
       sesion = userAgent.call("sip:"+num+"@"+KamailioIp, opciones);
       setCallState("Calling.... "+num, "yellowgreen");
       displayNumber.value = "";
     }
  }
  
  function setCallState(estado, color) {
    callSipStatus.parentNode.removeChild(callSipStatus);
    callSipStatus = document.createElement("em");
    var textCallSipStatus = document.createTextNode(estado);
    callSipStatus.style.color = color;
    callSipStatus.appendChild(textCallSipStatus);
    callStatus.appendChild(callSipStatus);
  }
  
  function defaultCallState() {
    if(callStatus.childElementCount > 0) {
      callSipStatus.parentNode.removeChild(callSipStatus);
    }
    callSipStatus = document.createElement("em");
    textCallSipStatus = document.createTextNode("Idle");
    callSipStatus.style.color = "#80FF00";
    callSipStatus.appendChild(textCallSipStatus);
    callStatus.appendChild(callSipStatus);
    $("#aTransfer").prop('disabled', true);
    $("#bTransfer").prop('disabled', true);
    $("#onHold").prop('disabled', true);
  }
  
  function setSipStatus(img, state, elem) {
    if(elem.childElementCount > 0) {
      var hijo1 = document.getElementById("textSipStatus");
      var hijo2 = document.getElementById("imgStatus");
      elem.removeChild(hijo1);
      elem.removeChild(hijo2);
    }
    iconStatus = document.createElement('img');
    textSipStatus = document.createTextNode(state);
    iconStatus.id = "imgStatus";
    textSipStatus.id = "textSipStatus";
    elem.style.color="white";
    iconStatus.src = "../static/ominicontacto/Img/"+img;
    elem.appendChild(iconStatus);
    elem.appendChild(textSipStatus);
  }
  
  function Sounds(callType, action) {
    var ring = null;
    if(action === "play") {
      if(callType === "In") {
        ring = document.getElementById('RingIn');
        ring.play();
      } else if(callType === "Out") {
        ring = document.getElementById('RingOut');
        ring.play();
      } else {
      	ring = document.getElementById('RingBusy');
        ring.play();
      }
    } else {
        ring = document.getElementById('RingIn');
        ring.pause();
        ring = document.getElementById('RingOut');
        ring.pause();
        ring = document.getElementById('RingBusy');
        ring.pause();
    }
  }
  
  function getBlankFormCamp(campid) {
    var url = '/campana/'+campid+'/formulario_nuevo/';
    $("#dataView").attr('src', url); 
  }
  
  function processCallid(callerid) {
  	var url = "/contacto/"+callerid+"/list/";
  	$("#dataView").attr('src', url);
  }
  
  function getData(campid, leadid,agentid) {
  	var url = "/formulario/"+campid+"/calificacion/"+leadid+"/update/"+agentid+"/";
  	$("#dataView").attr('src', url);
  }
  
});
