const {createClient, SchemaFieldTypes} = require('redis');

const {REDIS_HOST, REDIS_PORT, REDIS_PASSWORD} = require('./Constants.js');

class RedisStore{
    constructor(){
        this._createClient = this._createClient.bind(this);
        this.insertImage = this.insertImage.bind(this);
        this.getImage = this.getImage.bind(this);
        this.queryImage = this.queryImage.bind(this);
        this.insertStyle = this.insertStyle.bind(this);
        this.getStyle = this.getStyle.bind(this);

        this._createClient();
    }
    
    // TODO: Add an actual error handler, instead
    //       of just using console.log
    async _createClient(){
        const _this = this;

        if(this.client == null){
            try{
                const connectionUrl = "redis://" + REDIS_HOST + ":" + REDIS_PORT;
                console.log("connectionUrl: ", connectionUrl);
                this.client = createClient({url: connectionUrl});
                this.client.on('error', err => console.log('Redis Client Error', err));
                this.client.on('connect', () => console.log('Redis Client Connected'));
                await _this.client.connect();

                await _this.client.ft.create('idx:images', {
                    '$.styleId': {
                        type: SchemaFieldTypes.NUMERIC,
                        AS: 'styleId'
                    },
                    '$.text': {
                        type: SchemaFieldTypes.TEXT,
                        AS: 'text'
                    }
                }, {
                    ON: 'JSON'
                });
            }
            catch (error){
                console.log("Redis error: ", error);
            }
        }
    }
    
    async insertImage(id, data){
        const _this = this;

        if((id != null) && (data != null)){
            const {url, styleId, createdAt} = data;

            if((id != null) && (styleId != null) && (createdAt != null)){                
                await _this.client.json.set('image:'+id, '$', data);
            }
        }
        return null;
    }

    async getImage(id){
        let image = null;
        if(id != null){
            image = await client.hGetAll(id);
            console.log("Redis found image: ", image);
        }
        return image;
    }

    async queryImage(text, styleId){
        const _this = this;
        let image = null;

        // const query = '@text:' + text + ' @styleId:' + styleId;
        const query = '@styleId:' + styleId;
        // console.log("query: ", query);

        let results = await _this.client.ft.search('idx:images', query);
        console.log(results.total);

        if(results.documents.length > 0){
            const doc = results.documents[0];
            // console.log("results.documents: \n", results.documents);
            image = doc;
        }
        else{
            // console.log("No documents found!");
        } 
        return image;
    }

    async insertStyle(styleId, data){
        try{
            const _this = this;

            if((styleId != null) && (data != null)){
                const foundStyle = await _this.getStyle(styleId);
                if(foundStyle == null){
                    
                    console.log("RedisStore.insertStyle - Inserting style: ", styleId);
                    const {name, prompt} = data;
                    if((name != null) && (prompt != null)){
                        await _this.client.json.set(styleId.toString(), '$', data)
                    }
                }
                return foundStyle;
            }
            return null;
        }
        catch(error){
            console.log("findStyleById - error: ", error);
        }
    }

    async getStyle(styleId){

        // Redis is throwing in regular Node.js builds,
        // but not in Docker, trying to fix currently...
        try{
            const _this = this;

            let style = null;
            if(styleId != null){
                style = await _this.client.json.get(styleId.toString());
                console.log("RedisStore.getStyle - style: ", style);
                return style;
            }
            return null;

        }
        catch(error){
            console.log("findStyleById - error: ", error);
        }
    }
};

module.exports = new RedisStore();