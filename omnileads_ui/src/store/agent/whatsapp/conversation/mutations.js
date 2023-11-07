export default {
    agtWhatsCoversationSendMessage (state, message) {
        state.agtWhatsCoversationMessages.push(message);
    },
    agtWhatsCoversationReciveMessage (state, message) {
        state.agtWhatsCoversationMessages.push(message);
    },
    agtWhatsConversationInitMessages (state, messages) {
        state.agtWhatsCoversationMessages = messages;
    },
    agtWhatsConversationInfoInit (state, conversation = null) {
        state.agtWhatsCoversationInfo = {
            id: conversation ? conversation.id : null,
            campaignId: conversation ? conversation.campaing_id : null,
            campaignName: conversation ? conversation.campaing_name : null,
            destination: conversation ? conversation.destination : null,
            client: {
                id: conversation.client ? conversation.client.id : null,
                phone: conversation.client ? conversation.client.phone : null,
                data: conversation.client ? conversation.client.data : null,
                dispositionId: conversation.client ? conversation.client.disposition : null
            },
            agent: conversation ? conversation.agent : null,
            isActive: conversation ? conversation.is_active : null,
            expire: conversation ? conversation.expire : null,
            timestamp: conversation ? conversation.timestamp : null,
            messageNumber: conversation ? conversation.message_number : null,
            photo: conversation ? conversation.photo : null,
            lineNumber: conversation ? conversation.line_number : null
        };
    },
    agtWhatsChatsListInit (state, { isNew, inProgress }) {
        const chats = [];
        isNew.forEach((e) => {
            chats.push({
                id: e.id,
                from: e.client ? (e.client.name || e.client.phone) : e.destination,
                campaignId: e.campaing_id,
                campaignName: e.campaing_name,
                numMessages: e.message_number,
                photo: e.photo,
                isNew: true,
                isMine: false,
                answered: false,
                date: new Date(e.timestamp),
                expire: new Date(e.expire)
            });
        });
        inProgress.forEach((e) => {
            chats.push({
                id: e.id,
                from: e.client ? (e.client.name || e.client.phone) : e.destination,
                campaignId: e.campaing_id,
                campaignName: e.campaing_name,
                numMessages: e.message_number,
                photo: e.photo,
                isNew: false,
                isMine: true,
                answered: false,
                date: new Date(e.timestamp),
                expire: new Date(e.expire)
            });
        });
        state.agtWhatsChatsList = chats;
    },
    agtWhatsReceiveNewChat (state, chat = null) {
        if (chat) {
            state.agtWhatsChatsList.push({
                id: chat.id,
                from: chat.client_name,
                campaignId: chat.campaing_id,
                campaignName: chat.campaing_name,
                numMessages: chat.number_messages,
                photo: chat.photo,
                isNew: true,
                isMine: false,
                answered: false,
                date: new Date(chat.date)
            });
        }
    },
    agtWhatsSetCoversationInfo (state, conversation = null) {
        state.agtWhatsCoversationInfo = {
            id: conversation ? conversation.id : null,
            campaignId: conversation ? conversation.campaignId : null,
            campaignName: conversation ? conversation.campaignName : null,
            destination: conversation ? conversation.destination : null,
            client: {
                id: conversation.client ? conversation.client.id : null,
                phone: conversation.client ? conversation.client.phone : null,
                data: conversation.client ? conversation.client.data : null,
                dispositionId: conversation.client ? conversation.client.disposition : null
            },
            agent: conversation ? conversation.agent : null,
            isActive: conversation ? conversation.isActive : null,
            expire: conversation ? conversation.expire : null,
            timestamp: conversation ? conversation.timestamp : null,
            messageNumber: conversation ? conversation.messageNumber : null,
            photo: conversation ? conversation.photo : null,
            lineNumber: conversation ? conversation.lineNumber : null
        };
    },
    agtWhatsSetCoversationClientInfo (state, info = null) {
        state.agtWhatsCoversationInfo.client.id = info ? info.id : null;
        state.agtWhatsCoversationInfo.client.phone = info ? info.phone : null;
        state.agtWhatsCoversationInfo.client.data = info ? info.data : null;
        state.agtWhatsCoversationInfo.client.dispositionId = info.disposition || null;
        localStorage.setItem(
            'agtWhatsCoversationInfo',
            JSON.stringify(state.agtWhatsCoversationInfo)
        );
    },
    agtWhatsRestartExpiredCoversation (state, info = null) {
        if (info) {
            state.agtWhatsCoversationInfo.expire = info.expire;
            localStorage.setItem(
                'agtWhatsCoversationInfo',
                JSON.stringify(state.agtWhatsCoversationInfo)
            );
        }
    }
};
