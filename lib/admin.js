module.exports = {
    
    /**
     * Gets the guild members who are admins for the given guild
     * @param {object} obj: the context object containing obj.db.admins
     * @param {Guild} guild: the guild for which to get admins
     * @returns {Promise}: Resolves to a set of guild members who are admins
     */
    getAdmins: (obj, guild) => {
        return Promise.all([
            findPromise(obj, {guilds: guild.id}),
            guild.fetchMembers()
        ]).then(([docs, fetchedGuild]) => {
            let guildAdmins = fetchedGuild.members.filterArray(isGuildAdmin);

            let dbAdmins = docs.map(doc => fetchedGuild.members.get(doc._id)).filter(m => !!m);

            // not the most efficient way of doing distinct - perhaps keeping {guild,db}Admins as
            // maps id -> member would make it more efficient.
            let admins = guildAdmins.concat(dbAdmins).filter((ele, i, arr) => {
                return arr.map(mapEle => mapEle.id).indexOf(ele.id) === i;
            });

            return admins;
        })
    },

    /**
     * Returns if the given member is an admin for this guild.
     * @param {object} obj: the context object containing obj.db.admins
     * @param {Guild} guild: the guild to test in
     * @param {string} member: the member to test for admin status 
     * @returns {Promise}: resolves true if this member is an admin, false otherwise.
     */
    isAdmin: (obj, guild, member) => {
        return new Promise((resolve, reject) => {
            if(isGuildAdmin(member)) {
                resolve(true);
                return;
            }
            // else
            findPromise(obj, {_id: member.id, guilds: guild.id}).then(docs => {
                resolve(docs.length > 0);
            }).catch(reject);

        })
    },

    /**
     * Adds/removes the given member as an admin for this guild
     * @param {object} obj: the context object containing obj.db.admins
     * @param {Guild} guild: the guild to add/remove as an admin
     * @param {string} memberID: ID of the member to add/remove as admin
     * @param {boolean} value: whether to add/remove this member as admin (true/false respectively)
     * @returns {Promise}: resolves if it completed successfully, rejects otherwise.
     */
    setAdmin: (obj, guild, memberID, value) => {
        return new Promise((resolve, reject) => {
            if(!obj.db.admins) {
                reject("obj.db.admins does not exist");
                return;
            }
            //else
            let update = value
                        ? {$addToSet: {guilds: guild.id}} // to make an admin
                        : {$pull: {guilds: guild.id}}; // to remove admin

            obj.db.admins.update({_id: memberID}, update, {upsert: true}, 
                (err, count, docs, upsert) => {
                    if(err) {
                        reject(`Database error: ${err}`);
                    }
                    else {
                        resolve();
                    }
                }
            );
        })
    }
}

function isGuildAdmin(member) {
    return member.hasPermission("MANAGE_GUILD", false, true, true) && !member.user.bot;
}

function findPromise(obj, query) {
    return new Promise((resolve, reject) => {
        if(!obj.db.admins) {
            reject("obj.db.admins does not exist");
            return;
        }
        // else
        obj.db.admins.find(query, (err, docs) => {
            if(err) {
                reject(`Database error: ${err}`);
            }
            else {
                resolve(docs);
            }
        })
    })
}