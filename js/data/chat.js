var globalClient

var IM = {};

// constructor
IM.Client = function(options) {
	this.host = options.host;
	this.jid = options.jid;
	this.password = options.password;
	this.onConnected = options.onConnected;
	this.onMessage = options.onMessage;
	this.connection = new Strophe.Connection(this.host);
	this.jids = {};
};

IM.Client.prototype._onConnected = function() {
	console.log(this.password)
	//this.getRoster()
	this.connection.addHandler(_.bind(this._onMessage, this), null, 'message', 'chat');
	this.presence()
	this.onConnected()
}

IM.Client.prototype._onMessage = function (stanza) {
    stanza = $(stanza);

    var fullJid = stanza.attr('from'),
	    msgType = stanza.attr('type'),
        bareJid = Strophe.getBareJidFromJid(fullJid),
        body = stanza.find('body').text(),
        // TODO: fetch activity
        activity = 'active',
        message = {
            id: stanza.attr('id'),
            from: fullJid,
            body: body,
            activity: activity
        };

    // Reset addressing
    this.jids[bareJid] = fullJid;

    console.log("msg:"+fullJid+","+msgType+","+body)
	if (this.onMessage){
		this.onMessage(message)
	}
    return true;
};

IM.Client.prototype._onConnect = function(status) {
	var Status = Strophe.Status;

	switch (status) {
		case Status.ERROR:
			break;
		case Status.CONNECTING:
			break;
		case Status.CONNFAIL:
			break;
		case Status.AUTHENTICATING:
			break;
		case Status.AUTHFAIL:
			break;
		case Status.CONNECTED:
			this._onConnected();
			break;
		case Status.DISCONNECTING:
			break;
		case Status.DISCONNECTED:
			console.log("lost connection, try reconnect")
		    this.connect()
			break;
		case Status.ATTACHED:
			break;
	}
	return true;
}

IM.Client.prototype.connect = function() {
	this.connection.connect(this.jid, this.password, _.bind(this._onConnect, this));
}

IM.Client.prototype.send = function (stanza) {
    this.connection.send(stanza);
};

IM.Client.prototype.getRoster = function(roster) {
	var stanza = $iq({
		type: 'get'
	}).c('query', {
		xmlns: Strophe.NS.ROSTER
	});
	this.connection.sendIQ(stanza, function(iq) {
		var users = [];
		$(iq).find('item').each(function() {
			var jid = $(this).attr('jid');
			var name = $(this).attr('name');
			users.push({
				jid: jid,
				name: name
			})
		});
		if (roster) {
			roster(users)
		}

	});
}

IM.Client.prototype.presence = function (status) {
    var stanza = $pres();
    if (status) {
        stanza.attrs({type: status});
    }
    this.send(stanza);
};

function connect(onConnected,onMessage) {
	var user = plus.storage.getItem("user")
	var pwd = plus.storage.getItem("pwd")
	var jid = user + "@" + domain;
	var options = {
		host: xmpp_ws,
		jid: jid,
		password: pwd,
		onConnected: onConnected,
		onMessage: onMessage,
	}
	globalClient = new IM.Client(options)
	globalClient.connect()
}

function sendMsg(param,callback) {
	msgdb={
		id: guid(),
		sid: param.toJid,
		fromJid:'self',
		toJid:param.toJid,
		body: param.msg,
		type: 1,
		read: 1,
		time: nowTimestamp()
	}
	insertMsg(msgdb)
	var reply = $msg({
		to: param.toJid,
		from: param.fromJid,
		type: 'chat'
	}).cnode(Strophe.xmlElement('body', '', param.msg));
	console.log(reply.tree())
	globalClient.send(reply.tree());
}

function getContacts(param, callback) {
	globalClient.getRoster(callback)
}
