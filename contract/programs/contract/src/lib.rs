use anchor_lang::prelude::*;

use mpl_core::{instructions::CreateCollectionV2CpiBuilder, ID as MPL_CORE_ID};

use mpl_core::types::{
    AppDataInitInfo, ExternalPluginAdapterInitInfo, ExternalPluginAdapterSchema, FreezeDelegate,
    Plugin, PluginAuthority, PluginAuthorityPair,
};

declare_id!("2Q3mjBxjxmjafN75iv4gbMVfWSSZDKDebebUz5DZrGyv");

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateCollectionArgs {
    name: String,
    uri: String,
}

#[program]
pub mod create_core_collection_example {
    use super::*;

    pub fn create_core_collection(
        ctx: Context<CreateCollection>,
        args: CreateCollectionArgs,
    ) -> Result<()> {
        let update_authority = match &ctx.accounts.update_authority {
            Some(update_authority) => Some(update_authority.to_account_info()),
            None => None,
        };

        let mut plugins: Vec<PluginAuthorityPair> = vec![];

        plugins.push(PluginAuthorityPair {
            plugin: Plugin::FreezeDelegate(FreezeDelegate { frozen: true }),
            authority: Some(PluginAuthority::UpdateAuthority),
        });

        let mut external_plugin_adapters: Vec<ExternalPluginAdapterInitInfo> = vec![];

        let data_authority = ctx
            .accounts
            .update_authority
            .as_ref()
            .map(|ua| ua.key())
            .unwrap_or_else(|| ctx.accounts.payer.key());

        external_plugin_adapters.push(ExternalPluginAdapterInitInfo::AppData(AppDataInitInfo {
            init_plugin_authority: Some(PluginAuthority::UpdateAuthority),
            data_authority: PluginAuthority::Address {
                address: data_authority,
            },
            schema: Some(ExternalPluginAdapterSchema::Binary),
        }));

        CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
            .collection(&ctx.accounts.collection.to_account_info())
            .payer(&ctx.accounts.payer.to_account_info())
            .update_authority(update_authority.as_ref())
            .system_program(&ctx.accounts.system_program.to_account_info())
            .name(args.name)
            .uri(args.uri)
            .plugins(plugins)
            .external_plugin_adapters(external_plugin_adapters)
            .invoke()?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateCollection<'info> {
    #[account(mut)]
    pub collection: Signer<'info>,
    /// CHECK: this account will be checked by the mpl_core program
    pub update_authority: Option<UncheckedAccount<'info>>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(address = MPL_CORE_ID)]
    /// CHECK: this account is checked by the address constraint
    pub mpl_core_program: UncheckedAccount<'info>,
}
