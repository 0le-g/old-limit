import definePlugin from '@utils/types';

let bnumber;

export default definePlugin({
    name: 'OldLimit',
    description: 'Returns the old limit of 25 megabytes (until fixed)',
    authors: [{ name: '_.0leg._', id: 649957410697510912n }],
    patches: [
        {
            find: '/^<id:(home|browse',  //removes the limit on the client side
            replacement: {
                match: '10485760',
                replace: '26214400'
            }
        },
        {
            find: 'getUploadPayload:', //when sending a file the size will always be 100 bytes
            replacement: {
                match: /\i\.size/,
                replace: '100'
            }
        },
        {
            find: 'environment:w', //saves build_number (just in case)
            replacement: {
                match: /build_number:"(\d+)"/,
                replace: m => {
                    bnumber = m.match(/build_number:"(\d+)"/)?.[1];
                    return m;
                }
            }
        },
        {
            find: 'in this.header)', //removes client_build_number from X-Super-Properties if you send an attachment
            replacement: {
                match: /for\(let \i in this.header\)/,
                replace: 'if(this.header["X-Super-Properties"]){const xsuper = JSON.parse(atob(this.header["X-Super-Properties"])); if(this?._data?.attachments){delete xsuper.client_build_number}else{xsuper.client_build_number=$self.client_build_number()}; this.header["X-Super-Properties"]=btoa(JSON.stringify(xsuper))};$&'
            }
        }
    ],

    client_build_number() {
        return parseInt(bnumber);
    }

})
