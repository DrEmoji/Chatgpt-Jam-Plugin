const config = {
    "enabled": false, // enable for it to do stuff (set to true)
    "keyword": "", // what you want people say to activate the ai
    "prompt": "", // put prompt the api uses
    "apikey": "" // insert your api key here
}

async function GetAIResponse(userMessage) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.apikey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: config.prompt
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response";
}

module.exports = function ({ dispatch, application }) {

  const handleMessage = async ({ message }) => {
    const msg = message.value[5]
    console.log(msg);
    if (config.enabled && msg.includes(config.keyword)) {
      apimsg = await GetAIResponse(msg.replace(this.keyword,""));
      console.log(apimsg);
      const room = dispatch.getState('room')
      dispatch.sendRemoteMessage(`<msg t="sys"><body action="pubMsg" r="${room}"><txt><![CDATA[${apimsg}%0]]></txt></body></msg>`)
    }
  };

  dispatch.onMessage({
    type: 'aj',
    message: 'uc',
    callback: handleMessage,
  });
};
