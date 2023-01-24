import { createClient, RedisClientType } from "redis";
import { Logger } from "oicq";
import FileManagement from "./file";

interface DatabaseMethod {
	setTimeout( key: string, time: number ): Promise<void>;
	deleteKey( ...keys: string[] ): Promise<void>;
	getKeysByPrefix( prefix: string ): Promise<string[]>;
	/* Hash */
	setHash( key: string, value: any ): Promise<void>;
	getHash( key: string ): Promise<any>;
	delHash( key: string, ...fields: string[] ): Promise<void>;
	incHash( key: string, field: string, increment: number ): Promise<void>;
	existHashKey( key: string, field: string ): Promise<boolean>;
	setHashField(key: string, field: string, value: string): Promise<void>
	getHashField(key: string, field: string): Promise<any>;
	/* String */
	setString( key: string, value: any, timeout?: number ): Promise<void>;
	getString( key: string ): Promise<string | null>;
	/* List */
	getList( key: string ): Promise<string[]>;
	getListLength( key: string ): Promise<number>;
	addListElement( key: string, ...value: any[] ): Promise<void>;
	delListElement( key: string, ...value: any[] ): Promise<void>;
	existListElement( key: string, value: any ): Promise<boolean>;
	/* Set */
	getSet( key: string ): Promise<string[]>;
	getSetMemberNum( key: string ): Promise<number>;
	addSetMember( key: string, ...value: any[] ): Promise<void>;
	delSetMember( key: string, ...value: any[] ): Promise<void>;
	existSetMember( key: string, value: any ): Promise<boolean>;
}

export default class Database implements DatabaseMethod {
	public readonly client: RedisClientType;
	
	constructor( port: number, auth_pass, logger: Logger, file: FileManagement ) {
		const host: string = process.env.docker === "yes" ? "redis" : "localhost";
		
		this.client = createClient( {
			socket: {
				port,
				host
			},
			password: auth_pass
		} );
		this.client.on( "connect", async () => {
			logger.info( "Redis 数据库已连接" );
		} );
		this.client.connect().then();
	}
	
	public async setTimeout( key: string, time: number ): Promise<void> {
		await this.client.expire( key, time );
	}
	
	public async deleteKey( ...keys: string[] ): Promise<void> {
		for ( let k of keys ) {
			await this.client.del( k );
		}
	}
	
	public async getKeysByPrefix( prefix: string ): Promise<string[]> {
		const keys = this.client.keys( prefix + "*" );
		return keys || [];
	}
	
	public async setHash( key: string, value: any ): Promise<void> {
		await this.client.hSet( key, value );
	}
	
	public async getHash( key: string ): Promise<any> {
		const data = await this.client.hGetAll(key);
		return data || {};
	}

	public async setHashField(key: string, field: string, value: string): Promise<void> {
		await this.client.hSet(key, field,value);
	}

	public async getHashField(key: string, field: string): Promise<any> {
		const data = await this.client.hGet(key, field);
		return data || "";
	}
	
	public async delHash( key: string, ...fields: string[] ): Promise<void> {
		await this.client.hDel( key, fields );
	}
	
	public async incHash( key: string, field: string, increment: number ): Promise<void> {
		if ( parseInt( increment.toString() ) === increment ) {
			await this.client.hIncrBy( key, field, increment );
		} else {
			await this.client.hIncrByFloat( key, field, increment );
		}
	}
	
	public async existHashKey( key: string, field: string ): Promise<boolean> {
		return await this.client.hExists( key, field);
	}
	
	public async setString( key: string, value: any, timeout?: number ): Promise<void> {
		if ( timeout === undefined ) {
			await this.client.set( key, value );
		} else {
			await this.client.setEx( key, timeout, value );
		}
	}
	
	public async getString( key: string ): Promise<string> {
		const data = await this.client.get(key);
		return data || "";
	}
	
	public async getList( key: string ): Promise<string[]> {
		const data = await this.client.lRange(key, 0, -1);
		return data || [];
	}
	
	public async getListLength( key: string ): Promise<number> {
		const length = await this.client.lLen( key);
		return length || 0;
	}
	
	public async addListElement( key: string, ...value: any[] ): Promise<void> {
		await this.client.rPush( key, value );
	}
	
	public async delListElement( key: string, ...value: any[] ): Promise<void> {
		for ( let v of value ) {
			await this.client.lRem( key, 0, v );
		}
	}
	
	public async existListElement( key: string, value: any ): Promise<boolean> {
		const list: string[] = await this.getList( key );
		return list.includes( value.toString() );
	}
	
	public async getSet( key: string ): Promise<string[]> {
		const data = await this.client.sMembers(key);
		return data || [];
	}
	
	public async getSetMemberNum( key: string ): Promise<number> {
		const data = await this.client.sCard( key);
		return data || 0;
	}
	
	public async addSetMember( key: string, ...value: any[] ): Promise<void> {
		await this.client.sAdd( key, value );
	}
	
	public async delSetMember( key: string, ...value: any[] ): Promise<void> {
		await this.client.sRem( key, value );
	}
	
	public async existSetMember( key: string, value: any ): Promise<boolean> {
		return await this.client.sIsMember(key, value);
	}
}