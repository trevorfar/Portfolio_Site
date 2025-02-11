"""test

Revision ID: 00c34b300897
Revises: 81e9785382c8
Create Date: 2024-02-05 13:09:01.183994

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '00c34b300897'
down_revision = '81e9785382c8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('_alembic_tmp_users')  # Explicitly drop the table

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.create_unique_constraint('uq_email', ['email'])

    # ### end Alembic commands ###
    op.execute('DROP TABLE IF EXISTS _alembic_tmp_users')


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')

    op.create_table('_alembic_tmp_users',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('username', sa.VARCHAR(length=250), nullable=False),
    sa.Column('password', sa.VARCHAR(length=250), nullable=False),
    sa.Column('email', sa.VARCHAR(length=250), server_default=sa.text("('')"), nullable=False),
    sa.Column('gamesPlayed', sa.INTEGER(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email', name='unique_email'),
    sa.UniqueConstraint('username')
    )

    op.execute('INSERT INTO _alembic_tmp_users (id, username, password, email, "gamesPlayed") '
               'SELECT DISTINCT users.id, users.username, users.password, users.email, users."gamesPlayed" '
               'FROM users')
    # ### end Alembic commands ###
