import { MongoClient } from "mongodb";

export class Database extends MongoClient {
    /**
     * Accesses a database from a given url with a given name
     * @param {String} url URL of the database
     * @param {String} database name of the database
     */
    static async access(url, database) {
        return (await MongoClient.connect(url, { useUnifiedTopology: true })).db(database);
    }

    /**
     * Creates a collection with a given name
     * @param {Database} db Database you are accessing
     * @param {String} name Name of the collection to create
     */
    static async createCollection(db, name) {
        return await db.createCollection(name);
    }

    static async getCollection(db, name) {
        return db.collection(name);
    }

    static async insertInto(db, items) {
        if (Array.isArray(items)) {
            let itemList = [];

            for (let item of items) {
                itemList.push(await db.insertOne(item));
            }

            return itemList;
        } else {
            return await db.insertOne(items);
        }
    }

    /**
     * Searches by one or more queries
     * @param {Database} db Database to search
     * @param {Object} queries Object queries to search by, if any, if multiple
     * @param {Boolean} bool Whether or not to find one or many - One: True, Many: False
     */
    static async search(db, queries, bool = true) {
        if (queries) {
            if (Array.isArray(queries)) {
                let itemList = [];

                for (let query of queries) {
                    if (bool) {
                        itemList.push(await db.findOne(query));
                    } else {
                        itemList.push(await db.find(query));
                    }
                }

                return itemList;
            } else {
                if (bool) {
                    return await db.findOne(queries);
                } else {
                    return await db.find(queries);
                }
            }
        } else {
            if (bool) {
                return await db.findOne({});
            } else {
                return await db.find({});
            }
        }
    }

    /**
     * Sorts database by query
     * @param {Database} db 
     * @param {Object} query 
     */
    static async sort(db, query = { name: 1 }) {
        return await db.sort(query);
    }

    /**
     * Removes from database a list of queries, if not one
     * @param {*} db 
     * @param {*} queries 
     */
    static async remove(db, queries) {
        if (Array.isArray(queries)) {
            for (let query of queries) {
                await db.deleteOne(query);
            }
        } else {
            await db.deleteOne(queries);
        }
    }

    static async removeDatabase(db) {
        await db.drop();
    }

    static async update(db, set, queries) {
        if (Array.isArray(queries)) {
            let itemList = [];

            for (let query of queries) {
                itemList.push(await db.updateOne(set, { $set: query }));
            }

            return itemList;
        } else {
            return await db.updateOne(set, { $set: queries });
        }
    }
}