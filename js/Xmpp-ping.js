/*
 * 心跳组件Xmpp-ping.js
 * @Author: Rephontil 
 * @Date: 2018-09-14 09:46:44 
 * @Last Modified by: Damo
 * @Last Modified time: 2018-09-14 11:00:23
 */

var Strophe = require("strophe").Strophe;

Strophe.addConnectionPlugin('ping', {
    connection: null,

    // Strophe.Connection constructor 构造函数
    init: function(conn) {
        this.connection = conn;
        Strophe.addNamespace('PING', "urn:xmpp:ping");
        console.log("Strophe.Connection constructor Initialized!");
    },

    /**
     * Function: ping
     *
     * Parameters:
     * (String) to - The JID you want to ping
     * (Function) success - Callback function on success
     * (Function) error - Callback function on error
     * (Integer) timeout - Timeout in milliseconds
     */
    ping(jid, success, error, timeout) {
        var id = this.connection.getUniqueId('ping');
        // var iq = $iq({type: 'get', to: jid, id: id}).c(
                        // 'ping', {xmlns: Strophe.NS.PING});
        var IQ = this.builderIQ({type: 'get', to: jid, id: id}).c('ping', {xmlns: Strophe.NS.PING});
        this.connection.sendIQ(IQ, success, error, timeout);
    },

    /**
     * Function: pong
     *
     * Parameters:
     * (Object) ping - The ping stanza from the server.
     */
    pong(ping) {
        var from = ping.getAttribute('from');
        var id = ping.getAttribute('id');
        // var iq = $iq({type: 'result', to: from,id: id});
        var IQ = this.builderIQ({type: 'result', to: from,id: id});
        console.log("xmppPong ---->  from = ",from);
        console.log("xmppPong ---->  IQ = ",IQ);
        console.log("xmppPong ---->  id = ",id);
        this.connection.sendIQ(IQ);
    },

    /**
     * Function: addPingHandler
     *
     * Parameters:
     * (Function) handler - Ping handler
     *
     * Returns:
     * A reference to the handler that can be used to remove it.
     */
    addPingHandler(handler) {
        return this.connection.addHandler(handler, Strophe.NS.PING, "iq", "get");
    },

    /**
     * 构建IQ类型消息体
     * @param {消息结构体} attrs 
     */
    builderIQ(attrs){
        return new Strophe.Builder("iq", attrs); 
    },
});