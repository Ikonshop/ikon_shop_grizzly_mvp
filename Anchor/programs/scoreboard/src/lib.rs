use anchor_lang::prelude::*;
use solana_program::program::invoke;
use solana_program::system_instruction;
use solana_program::system_program;
use solana_program::system_instruction::transfer;
use std::str::FromStr;
use anchor_lang::system_program::Transfer;

declare_id!("G6PHe1YMRavytrbhouywmfnS3iADfQyABUuGiiEFNFGA");

#[program]
pub mod scoreboard {
    use super::*;

    pub fn get_scores(ctx: Context<GetScores>) -> Result <()> {
        // Get a reference to the account.
        let base_account = &mut ctx.accounts.base_account;
        // Initialize total_scores.
        base_account.total_scores = 0;
        Ok(())
    }


    pub fn add_score(ctx: Context<AddScore>, score: String) -> Result <()> {
        // Get a reference to the account and increment total_scores.
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;
        let system_program = &mut ctx.accounts.system_program;
        let fund_account = &mut ctx.accounts.fund_account;

        let item = ItemStruct {
            score: score.to_string(),
            user_address: *user.to_account_info().key,
        };

        // Add it to the gif_list vector.
        base_account.score_list.push(item);
        base_account.total_scores += 1;
        // convert score to an integer
        if base_account.total_scores % 10 == 0 {

        

        msg!("Score added to scoreboard");
        msg!("Total scores on scoreboard {}", base_account.total_scores);

        // amount will be .25 SOL
        let amount1 = 250000000;
        // amount2 will be .2 SOL
        let amount2 = 200000000;
        // amount3 will be .15 SOL
        let amount3 = 150000000;
        // amount4 will be .1 SOL
        let amount4 = 100000000;
        // get the length of the score_list vector
        let length = base_account.score_list.len();
        
        //sort score_list vector by the score_list.score value, and grab the top 10
        base_account.score_list.sort_by(|a, b| b.score.cmp(&a.score));
        let top_ten = &base_account.score_list[0..10];
        // loop through the top_ten vector and pay out the top 10
        // for each item in the top_ten vector, pay out the user
        // the amount of SOL based on their position in the top_ten vector

        for i in 0..top_ten.len() {
            if i == 0 {
                invoke(
                    &system_instruction::transfer(
                        &fund_account.key,
                        &top_ten[i].user_address,
                        amount1,
                    ),
                    &[
                        fund_account.to_account_info(),
                        user.to_account_info(),
                        system_program.to_account_info(),
                    ],
                )?;
            }
            if i == 1 {
                invoke(
                    &system_instruction::transfer(
                        &fund_account.key,
                        &top_ten[i].user_address,
                        amount2,
                    ),
                    &[
                        fund_account.to_account_info(),
                        user.to_account_info(),
                        system_program.to_account_info(),
                    ],
                )?;
            }
            if i == 2 {
                invoke(
                    &system_instruction::transfer(
                        &fund_account.key,
                        &top_ten[i].user_address,
                        amount3,
                    ),
                    &[
                        fund_account.to_account_info(),
                        user.to_account_info(),
                        system_program.to_account_info(),
                    ],
                )?;
            }
            if i > 2 {
                invoke(
                    &system_instruction::transfer(
                        &fund_account.key,
                        &top_ten[i].user_address,
                        amount4,
                    ),
                    &[
                        fund_account.to_account_info(),
                        user.to_account_info(),
                        system_program.to_account_info(),
                    ],
                )?;
            }
        }
    }
        Ok(())
    }

    
  }
  
#[derive(Accounts)]
pub struct GetScores<'info> {
    #[account(init, payer = user, space = 10000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}

#[derive(Accounts, Clone)]
pub struct AddScore<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub user: AccountInfo<'info>,
    pub system_program: Program <'info, System>,
    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub fund_account: Signer<'info>, 
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub score: String,
    pub user_address: Pubkey,
}

#[account]
pub struct BaseAccount {
    pub total_scores: u64,
    // Attach a Vector of type ItemStruct to the account.
    pub score_list: Vec<ItemStruct>,
}

