use crate::{error::SubRegisterError, processor::Processor};

use {
    num_traits::FromPrimitive,
    solana_program::{
        account_info::AccountInfo, entrypoint::ProgramResult, msg, program_error::ProgramError,
        pubkey::Pubkey,
    },
};

#[cfg(not(feature = "no-entrypoint"))]
use solana_program::entrypoint;
#[cfg(not(feature = "no-entrypoint"))]
entrypoint!(process_instruction);

/// The entrypoint to the program
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("Entrypoint");
    if let Err(error) = Processor::process_instruction(program_id, accounts, instruction_data) {
        match &error {
            ProgramError::Custom(error_id) => {
                if let Some(local_error) = SubRegisterError::from_u32(*error_id) {
                    msg!("[+] Error: {}", local_error);
                } else {
                    msg!("External custom program error: {:#x}", error_id);
                }
            }
            error => msg!("Error: {}", error),
        }
        return Err(error);
    }
    Ok(())
}
