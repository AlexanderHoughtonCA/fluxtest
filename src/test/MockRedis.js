

class MockRedis{

    constructor(){
        this._createClient = this._createClient.bind(this);
        this.insertImage = this.insertImage.bind(this);
        this.getImage = this.getImage.bind(this);
        this.queryImage = this.queryImage.bind(this);
        this.insertStyle = this.insertStyle.bind(this);
        this.getStyle = this.getStyle.bind(this);
    }
    
    async _createClient(){        
    }
    
    async insertImage(id, data){
    }

    async getImage(id){        
    }

    async queryImage(text, styleId){        
    }

    async insertStyle(styleId, data){       
    }

    async getStyle(styleId){
    }        
}

module.exports = MockRedis;