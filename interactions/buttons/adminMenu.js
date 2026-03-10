module.exports = {

    id:"close_menu",
    
    async execute(interaction){
    
    await interaction.message.delete();
    
    }
    
    };