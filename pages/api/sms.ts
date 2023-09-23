import twilio from 'twilio';

export default async function handler (req: { body: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { answer: string; }): void; new(): any; }; }; }) {

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const smsMessage = JSON.parse(req.body.question).question;
    const phone = "+12019818820"
;
    try {

    client.messages
    .create({
        body: smsMessage,
        from: '+18445042408',
        to: phone
    })
    .then(message => console.log(message.sid));

 } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send SMS.' });
    }
    res.status(200).send('<Response></Response>');
}
